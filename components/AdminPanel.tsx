import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSite, SiteSettings } from '@/context/SiteContext';
import { contentSchema, getContentDefault } from '@/lib/contentSchema';

interface AdminPanelProps {
  onClose: () => void;
}

// Default values for top-level settings fields
const TOP_LEVEL_DEFAULTS: Record<string, string> = {
  brand_name: 'Grave Care Kashmir',
  whatsapp_number: '917006830501',
  whatsapp_message: '',
  instagram_profile_url: '',
  facebook_profile_url: '',
  hero_title: "Your Family's Resting Place, Maintained with Dignity.",
  hero_subtitle: 'We clean, align, and restore graves for families who want to keep resting places in proper condition. Our work spans across Srinagar and local qabristans.',
  cta_title: 'Let us care for their resting place.',
  cta_text: 'Send us a message. We will listen to your wishes and carefully coordinate every detail to bring you comfort.',
};

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { settings, workMedia, refreshSettings } = useSite();
  const [activeTab, setActiveTab] = useState('general');
  
  // Auth State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'pin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [contentData, setContentData] = useState<Record<string, string>>({});
  
  // Media State
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaThumbnail, setNewMediaThumbnail] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [isMediaSaving, setIsMediaSaving] = useState(false);

  // Security State (Change PIN)
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  useEffect(() => {
    // Freeze body scrolling on mount to prevent double scrollbar and background movement
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setIsUnlocked(true);
      }
    });

    if (settings) {
      // Pre-populate form with actual values from DB, falling back to defaults
      setFormData({
        brand_name: settings.brand_name || TOP_LEVEL_DEFAULTS.brand_name,
        whatsapp_number: settings.whatsapp_number || TOP_LEVEL_DEFAULTS.whatsapp_number,
        whatsapp_message: settings.whatsapp_message ?? '',
        instagram_profile_url: settings.instagram_profile_url || '',
        facebook_profile_url: settings.facebook_profile_url || '',
        hero_title: settings.hero_title || TOP_LEVEL_DEFAULTS.hero_title,
        hero_subtitle: settings.hero_subtitle || TOP_LEVEL_DEFAULTS.hero_subtitle,
        cta_title: settings.cta_title || TOP_LEVEL_DEFAULTS.cta_title,
        cta_text: settings.cta_text || TOP_LEVEL_DEFAULTS.cta_text,
      });

      // Pre-populate content_json with actual values, filling empty ones with schema defaults
      const existingContent = settings.content_json || {};
      const populatedContent: Record<string, string> = {};
      
      for (const group of contentSchema) {
        for (const field of group.fields) {
          // Use existing DB value if set, otherwise use schema default
          populatedContent[field.key] = existingContent[field.key] || field.defaultValue || '';
        }
      }
      
      setContentData(populatedContent);
    }

    return () => {
      // Restore scrolling on unmount
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [settings]);

  // Track changes
  const updateFormData = useCallback((updates: Partial<SiteSettings>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);

  const updateContentData = useCallback((key: string, value: string) => {
    setContentData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const handleSupabaseLogin = async () => {
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setAuthError(error.message);
    } else if (data.session) {
      setSession(data.session);
      setIsUnlocked(true);
    }
  };

  const handlePinLogin = async () => {
    setAuthError('');
    const { data, error } = await supabase.rpc('verify_recovery_pin', { pin });
    if (error) {
      setAuthError(error.message);
    } else if (data) {
      setIsUnlocked(true);
      // Note: No session is set, so DB writes will fail.
    } else {
      setAuthError('Invalid Recovery PIN.');
    }
  };

  const handleClose = async () => {
    // Auto-lock: sign out and reset state on close
    try {
      await supabase.auth.signOut();
    } catch (_) {
      // Ignore errors during signout
    }
    setSession(null);
    setIsUnlocked(false);
    setEmail('');
    setPassword('');
    setPin('');
    setAuthError('');
    setHasChanges(false);
    setSaveMessage(null);
    onClose();
  };

  const handleSave = async () => {
    if (!session) {
      setSaveMessage({ type: 'error', text: 'You are in Read-Only mode (Recovery PIN). Full Admin Login (Email/Password) is required to save changes.' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    
    const { error } = await supabase
      .from('site_settings')
      .update({
        ...formData,
        content_json: contentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'main');

    if (error) {
      setSaveMessage({ type: 'error', text: 'Error saving: ' + error.message });
    } else {
      setSaveMessage({ type: 'success', text: 'Settings saved successfully! Changes are now live.' });
      setHasChanges(false);
      await refreshSettings();
    }
    setIsSaving(false);
    
    // Auto-clear success message after 4 seconds
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleAddMedia = async () => {
    if (!session) {
      setSaveMessage({ type: 'error', text: 'Database writes require full Admin Login.' });
      return;
    }
    if (!newMediaUrl) {
      setSaveMessage({ type: 'error', text: 'Please provide an image/video URL.' });
      return;
    }

    setIsMediaSaving(true);
    const { error } = await supabase
      .from('work_media')
      .insert([{
        file_url: newMediaUrl,
        storage_path: newMediaThumbnail || null,
        caption: newMediaCaption,
        file_type: newMediaUrl.includes('.mp4') ? 'video' : 'image',
      }]);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Error adding media: ' + error.message });
    } else {
      setNewMediaUrl('');
      setNewMediaThumbnail('');
      setNewMediaCaption('');
      await refreshSettings();
      setSaveMessage({ type: 'success', text: 'Media added successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
    setIsMediaSaving(false);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!session) return;
    if (!confirm("Are you sure you want to remove this media link?")) return;

    const { error } = await supabase
      .from('work_media')
      .delete()
      .eq('id', id);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Error deleting media: ' + error.message });
    } else {
      await refreshSettings();
    }
  };

  const handleChangePin = async () => {
    setPinChangeError('');
    setPinChangeSuccess('');

    if (!session) {
      setPinChangeError('Full Admin Login is required to change the Recovery PIN.');
      return;
    }
    if (!currentPin || !newPin || !confirmPin) {
      setPinChangeError('Please fill in all PIN fields.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeError('New PIN and Confirm PIN do not match.');
      return;
    }
    if (newPin.length < 4) {
      setPinChangeError('New PIN must be at least 4 characters.');
      return;
    }

    setIsChangingPin(true);
    try {
      const { data, error } = await supabase.rpc('update_recovery_pin', {
        old_pin: currentPin,
        new_pin: newPin,
      });

      if (error) {
        setPinChangeError(error.message);
      } else if (data === false) {
        setPinChangeError('Current PIN is incorrect.');
      } else {
        setPinChangeSuccess('Recovery PIN updated successfully!');
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        setTimeout(() => setPinChangeSuccess(''), 4000);
      }
    } catch (err: any) {
      setPinChangeError('Failed to update PIN: ' + (err?.message || 'Unknown error'));
    }
    setIsChangingPin(false);
  };

  const availableTabs = session 
    ? ['general', 'social', 'copy', 'media', 'security'] 
    : ['general', 'social', 'copy', 'media'];

  const tabLabels: Record<string, string> = {
    general: 'General',
    social: 'Socials', 
    copy: 'Website Text',
    media: 'Work Media',
    security: 'Security',
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md p-4 overflow-y-auto flex items-start justify-center pt-10">
      <div className="w-full max-w-4xl bg-[#0b120e] border border-border/40 rounded-3xl shadow-2xl overflow-hidden relative mb-10">
        <div className="flex justify-between items-center p-6 border-b border-border/20 bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-white/60">Manage your Grave Care Kashmir website settings.</p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full border border-border/40 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!isUnlocked ? (
            <div className="max-w-md mx-auto space-y-6 py-8">
              <div className="flex border border-white/10 rounded-xl overflow-hidden bg-white/5 mb-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-3 text-xs font-bold uppercase transition-colors ${authMode === 'login' ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10'}`}
                >
                  Admin Login
                </button>
                <button
                  onClick={() => setAuthMode('pin')}
                  className={`flex-1 py-3 text-xs font-bold uppercase border-l border-white/10 transition-colors ${authMode === 'pin' ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10'}`}
                >
                  Recovery PIN
                </button>
              </div>

              {authError && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{authError}</div>}

              {authMode === 'login' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/70">Admin Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/70">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
                  </div>
                  <button onClick={handleSupabaseLogin} className="w-full py-3 bg-gradient-to-r from-[#25d366] to-[#b9ffc7] text-[#052011] font-bold rounded-xl mt-2">Login Securely</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/70">Recovery PIN</label>
                    <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter local recovery PIN" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
                  </div>
                  <button onClick={handlePinLogin} className="w-full py-3 bg-white/20 text-white font-bold rounded-xl mt-2 hover:bg-white/30">Unlock UI</button>
                  <p className="text-xs text-white/40 text-center">Note: Recovery PIN allows viewing the panel, but saving requires full login.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Read-only mode warning — prominent */}
              {!session && (
                <div className="p-4 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-200 text-sm flex items-center gap-3">
                  <Lock className="h-5 w-5 shrink-0" />
                  <div>
                    <strong className="block">Read-Only Mode</strong>
                    You unlocked via Recovery PIN. Saving changes requires full Admin Login (Email + Password).
                  </div>
                </div>
              )}

              {/* Save message toast */}
              {saveMessage && (
                <div className={`p-3 rounded-lg text-sm border ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-500/20 border-green-500/50 text-green-200' 
                    : 'bg-red-500/20 border-red-500/50 text-red-200'
                }`}>
                  {saveMessage.text}
                </div>
              )}
              
              {/* Tabs */}
              <div className="flex border border-white/10 rounded-xl overflow-hidden bg-white/5 flex-wrap">
                {availableTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-2 text-xs font-bold tracking-widest uppercase border-r border-white/10 last:border-r-0 transition-colors ${
                      activeTab === tab ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>

              {activeTab === 'general' && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-6">
                  <div>
                    <h3 className="text-xl text-white mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Business / Brand name</label>
                        <input type="text" value={formData.brand_name || ''} onChange={e => updateFormData({ brand_name: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.brand_name} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">WhatsApp number (with country code, e.g. 917006830501)</label>
                        <input type="text" value={formData.whatsapp_number || ''} onChange={e => updateFormData({ whatsapp_number: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.whatsapp_number} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-white/60">WhatsApp default message (pre-filled when user clicks chat button)</label>
                        <textarea rows={2} value={formData.whatsapp_message || ''} onChange={e => updateFormData({ whatsapp_message: e.target.value })} placeholder="e.g. Assalamu Alaikum, I would like to inquire about grave care services..." className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white mb-4">Hero Section Text</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Hero Main Title (Use a comma to split lines, e.g. "Line 1, Line 2")</label>
                        <input type="text" value={formData.hero_title || ''} onChange={e => updateFormData({ hero_title: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.hero_title} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Hero Subtitle</label>
                        <textarea rows={2} value={formData.hero_subtitle || ''} onChange={e => updateFormData({ hero_subtitle: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.hero_subtitle} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white mb-4">CTA Section Text</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">CTA Heading</label>
                        <input type="text" value={formData.cta_title || ''} onChange={e => updateFormData({ cta_title: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.cta_title} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">CTA Subtext</label>
                        <textarea rows={2} value={formData.cta_text || ''} onChange={e => updateFormData({ cta_text: e.target.value })} placeholder={TOP_LEVEL_DEFAULTS.cta_text} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white mb-4">Contact Form Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Form Submission Method</label>
                        <select 
                          value={contentData.form_submit_method || 'whatsapp'}
                          onChange={e => updateContentData('form_submit_method', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none"
                        >
                          <option value="whatsapp">Send via WhatsApp</option>
                          <option value="email">Send via Email</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Admin Email (for receiving forms)</label>
                        <input 
                          type="email" 
                          value={contentData.admin_email || ''} 
                          onChange={e => updateContentData('admin_email', e.target.value)} 
                          placeholder="admin@example.com"
                          className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm placeholder:text-white/25" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-4">
                  <h3 className="text-xl text-white">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60">Instagram URL</label>
                      <input type="text" value={formData.instagram_profile_url || ''} onChange={e => updateFormData({ instagram_profile_url: e.target.value })} placeholder="https://instagram.com/your-profile" className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60">Facebook URL</label>
                      <input type="text" value={formData.facebook_profile_url || ''} onChange={e => updateFormData({ facebook_profile_url: e.target.value })} placeholder="https://facebook.com/your-page" className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm placeholder:text-white/25" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'copy' && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl text-white">Website Text Editor</h3>
                      <p className="text-xs text-white/40 mt-1">All fields are pre-filled with default text. Edit any field to customize your website content. Clearing a field will revert to the default shown as placeholder text.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm('Reset all website text fields to their default values? This will clear any custom text you have entered. You still need to press "Save Changes" to apply.')) return;
                        const resetContent: Record<string, string> = {};
                        for (const group of contentSchema) {
                          for (const field of group.fields) {
                            resetContent[field.key] = '';
                          }
                        }
                        setContentData(resetContent);
                        setHasChanges(true);
                      }}
                      className="shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wide text-amber-200 bg-amber-500/20 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 transition-colors whitespace-nowrap"
                    >
                      Reset All to Defaults
                    </button>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto pr-4 space-y-10 custom-scrollbar">
                    {contentSchema.map(group => (
                      <div key={group.id} className="space-y-4">
                        <div className="border-b border-primary/30 pb-2">
                          <h4 className="text-lg font-bold text-primary">{group.title}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {group.fields.map(field => (
                            <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2 space-y-1' : 'space-y-1'}>
                              <label className="text-xs font-bold text-white/60">{field.label}</label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  rows={3}
                                  value={contentData[field.key] || ''}
                                  onChange={e => updateContentData(field.key, e.target.value)}
                                  placeholder={field.defaultValue || ''}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={contentData[field.key] || ''}
                                  onChange={e => updateContentData(field.key, e.target.value)}
                                  placeholder={field.defaultValue || ''}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-8">
                  <div>
                    <h3 className="text-xl text-white mb-1">Social Work Links</h3>
                    <p className="text-sm text-white/60">Manage your Instagram/Facebook work links here.</p>
                  </div>

                  {/* Add New Media Form */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white">Add New Media Link</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-white/60">Social Post URL</label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/..."
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/25"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/60">Thumbnail Image URL</label>
                        <input
                          type="text"
                          placeholder="https://... (Direct image link)"
                          value={newMediaThumbnail}
                          onChange={(e) => setNewMediaThumbnail(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/25"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-white/60">Caption (Optional)</label>
                        <input
                          type="text"
                          placeholder="Restoration at Malkhah..."
                          value={newMediaCaption}
                          onChange={(e) => setNewMediaCaption(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/25"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddMedia}
                      disabled={isMediaSaving || !session}
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isMediaSaving ? 'Adding...' : 'Add to Gallery'}
                    </button>
                  </div>

                  {/* Existing Media List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Current Gallery</h4>
                    {workMedia.length === 0 ? (
                      <div className="text-white/40 text-sm italic p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                        No media links added yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {workMedia.map((media) => (
                          <div key={media.id} className="relative bg-white/5 p-2 rounded-xl border border-white/10 flex items-start gap-3 group">
                            <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden shrink-0 flex items-center justify-center">
                              {media.storage_path ? (
                                <img src={media.storage_path} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Broken')} />
                              ) : media.file_type === 'video' ? (
                                <span className="text-xs font-bold text-white/50">VIDEO</span>
                              ) : (
                                <img src={media.file_url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Link')} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                              <p className="text-xs font-semibold text-white truncate" title={media.caption || 'No caption'}>
                                {media.caption || 'No caption'}
                              </p>
                              <p className="text-[10px] text-white/40 truncate mt-1">
                                {media.file_url}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteMedia(media.id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'security' && session && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-6">
                  <div>
                    <h3 className="text-xl text-white mb-1 flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-primary" /> Security Settings
                    </h3>
                    <p className="text-sm text-white/60">Manage your Recovery PIN for quick panel access.</p>
                  </div>

                  <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white">Change Recovery PIN</h4>
                    <p className="text-xs text-white/40">The Recovery PIN allows read-only access to this admin panel without full login credentials.</p>

                    {pinChangeError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{pinChangeError}</div>
                    )}
                    {pinChangeSuccess && (
                      <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">{pinChangeSuccess}</div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Current PIN</label>
                        <div className="relative">
                          <input 
                            type={showCurrentPin ? 'text' : 'password'} 
                            value={currentPin} 
                            onChange={e => setCurrentPin(e.target.value)} 
                            placeholder="Enter current PIN" 
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none pr-10 placeholder:text-white/25" 
                          />
                          <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                            {showCurrentPin ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">New PIN</label>
                        <div className="relative">
                          <input 
                            type={showNewPin ? 'text' : 'password'} 
                            value={newPin} 
                            onChange={e => setNewPin(e.target.value)} 
                            placeholder="Enter new PIN (min 4 characters)" 
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none pr-10 placeholder:text-white/25" 
                          />
                          <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                            {showNewPin ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Confirm New PIN</label>
                        <input 
                          type="password" 
                          value={confirmPin} 
                          onChange={e => setConfirmPin(e.target.value)} 
                          placeholder="Re-enter new PIN" 
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/25" 
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleChangePin}
                      disabled={isChangingPin}
                      className="px-5 py-2 bg-amber-500/80 text-white text-sm font-semibold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50"
                    >
                      {isChangingPin ? 'Updating...' : 'Update Recovery PIN'}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button 
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  Log out & Close
                </button>
                <div className="flex gap-3 items-center">
                  {!session && (
                    <span className="text-xs text-amber-400/70 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Read-Only
                    </span>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || !session}
                    className={`relative px-6 py-2.5 font-bold rounded-full transition-all disabled:opacity-50 ${
                      session 
                        ? 'bg-gradient-to-r from-[#25d366] to-[#b9ffc7] text-[#052011] hover:scale-105' 
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                    {hasChanges && session && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
