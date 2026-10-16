import { Order, AssignedDNSConfig, Product } from '@/types';
import { getProductById, generateLicenseKey } from './store-db';

export interface ProvisionResult {
  success: boolean;
  configs?: AssignedDNSConfig[];
  error?: string;
  providerStatus: 'automated' | 'manual-queued' | 'error';
}

/**
 * Extensible DNS Provider Adapter Interface
 * Allows seamless swap between static cluster allocation and dynamic PowerDNS/Bind9/NextDNS/AdGuard APIs.
 */
export interface DNSProviderAdapter {
  name: string;
  isConfigured(): boolean;
  provision(order: Order, product: Product): Promise<{
    primaryIP: string;
    secondaryIP: string;
    dohUrl: string;
    dotHost: string;
    licenseKey: string;
  }>;
}

/**
 * Standard Cluster Assignment Adapter
 * Securely binds verified customer orders to configured high-availability Anycast nodes
 */
export class ClusterAssignmentAdapter implements DNSProviderAdapter {
  name = 'NEXORA High-Availability Anycast Cluster';

  isConfigured(): boolean {
    return true;
  }

  async provision(order: Order, product: Product) {
    const licenseKey = generateLicenseKey();
    const cleanHost = product.dnsConfig.dotHost || 'core.nexoradns.com';
    const cleanDoH = product.dnsConfig.dohUrl || 'https://doh.nexoradns.com/dns-query';

    return {
      primaryIP: product.dnsConfig.primaryIP,
      secondaryIP: product.dnsConfig.secondaryIP,
      dohUrl: `${cleanDoH}?key=${licenseKey}&sub=${order.id}`,
      dotHost: cleanHost,
      licenseKey,
    };
  }
}

/**
 * External REST Provider Adapter
 * Ready for live PowerDNS / Cloudflare / Custom DNS daemon API integration
 */
export class ExternalRESTProviderAdapter implements DNSProviderAdapter {
  name = 'External DNS REST Provisioner';
  private endpoint = process.env.DNS_PROVIDER_API_ENDPOINT;
  private apiKey = process.env.DNS_PROVIDER_API_KEY;

  isConfigured(): boolean {
    return Boolean(this.endpoint && this.apiKey);
  }

  async provision(order: Order, product: Product) {
    if (!this.isConfigured()) {
      throw new Error('External DNS Provider endpoint or API key not configured.');
    }

    const response = await fetch(`${this.endpoint}/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        orderId: order.id,
        customerId: order.customerId,
        customerEmail: order.customerEmail,
        productSlug: product.slug,
        duration: product.duration,
      }),
    });

    if (!response.ok) {
      throw new Error(`DNS Provider API rejected provision: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      primaryIP: data.primaryIP,
      secondaryIP: data.secondaryIP,
      dohUrl: data.dohUrl,
      dotHost: data.dotHost,
      licenseKey: data.licenseKey,
    };
  }
}

/**
 * Master Provisioning Orchestrator
 */
export async function provisionOrderDNS(order: Order): Promise<ProvisionResult> {
  // If already fulfilled, return existing assigned configs (Idempotent)
  if (order.fulfillmentStatus === 'fulfilled' && order.assignedConfigurations?.length > 0) {
    return {
      success: true,
      configs: order.assignedConfigurations,
      providerStatus: 'automated',
    };
  }

  const externalAdapter = new ExternalRESTProviderAdapter();
  const clusterAdapter = new ClusterAssignmentAdapter();

  const activeAdapter: DNSProviderAdapter = externalAdapter.isConfigured()
    ? externalAdapter
    : clusterAdapter;

  const assignedList: AssignedDNSConfig[] = [];

  try {
    for (const item of order.items) {
      const product = getProductById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found in catalog.`);
      }

      const allocated = await activeAdapter.provision(order, product);

      let expiresAt: string | undefined;
      const now = new Date();
      if (product.duration === 'trial-3d') {
        expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      } else if (product.duration === '1-month') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (product.duration === '3-months') {
        expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
      } else if (product.duration === '1-year') {
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      assignedList.push({
        productId: product.id,
        productName: product.name,
        primaryIP: allocated.primaryIP,
        secondaryIP: allocated.secondaryIP,
        dohUrl: allocated.dohUrl,
        dotHost: allocated.dotHost,
        licenseKey: allocated.licenseKey,
        assignedAt: new Date().toISOString(),
        expiresAt,
        setupGuideUrl: `/setup-guides/${product.supportedPlatforms[0]?.toLowerCase().includes('ios') ? 'ios' : 'android'}`
      });
    }

    return {
      success: true,
      configs: assignedList,
      providerStatus: 'automated',
    };
  } catch (error: any) {
    console.error('Automated DNS Provisioning failed:', error);
    return {
      success: false,
      error: error.message || 'Provisioning service error',
      providerStatus: 'manual-queued',
    };
  }
}
