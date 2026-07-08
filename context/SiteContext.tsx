import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SiteSettings = {
  id: string;
  brand_name: string;
  whatsapp_number: string;
  instagram_profile_url: string;
  facebook_profile_url: string;
  hero_title: string;
  hero_subtitle: string;
  whatsapp_message: string;
  cta_title: string;
  cta_text: string;
  content_json: Record<string, string>;
};

export type WorkMedia = {
  id: string;
  file_url: string;
  storage_path: string | null;
  file_type: string;
  caption: string | null;
  created_at: string;
};

type SiteContextType = {
  settings: SiteSettings | null;
  workMedia: WorkMedia[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [workMedia, setWorkMedia] = useState<WorkMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [settingsRes, mediaRes] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 'main').single(),
        supabase.from('work_media').select('*').order('created_at', { ascending: false })
      ]);

      if (settingsRes.data) {
        setSettings(settingsRes.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gck_settings', JSON.stringify(settingsRes.data));
        }
      }
      
      if (mediaRes.data) {
        setWorkMedia(mediaRes.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gck_media', JSON.stringify(mediaRes.data));
        }
      }
    } catch (error) {
      console.error('Error fetching site data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Stale-While-Revalidate: load immediately from localStorage cache on client mount
    if (typeof window !== 'undefined') {
      const cachedSettings = localStorage.getItem('gck_settings');
      const cachedMedia = localStorage.getItem('gck_media');
      
      if (cachedSettings) {
        try {
          setSettings(JSON.parse(cachedSettings));
          setLoading(false); // cached data exists, disable block loader immediately
        } catch (e) {
          console.warn('Failed to parse cached settings:', e);
        }
      }
      
      if (cachedMedia) {
        try {
          setWorkMedia(JSON.parse(cachedMedia));
        } catch (e) {
          console.warn('Failed to parse cached media:', e);
        }
      }
    }
    
    fetchSettings();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, workMedia, loading, refreshSettings: fetchSettings }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
