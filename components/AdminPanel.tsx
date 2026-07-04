import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSite, SiteSettings } from '@/context/SiteContext';
import { contentSchema } from '@/lib/contentSchema';

interface AdminPanelProps {
  onClose: () => void;
}

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
  const [session, setSession] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [contentData, setContentData] = useState<Record<string, string>>({});
  
  // Media State
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaThumbnail, setNewMediaThumbnail] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [isMediaSaving, setIsMediaSaving] = useState(false);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setIsUnlocked(true);
      }
    });

    if (settings) {
      setFormData({
        brand_name: settings.brand_name,
        whatsapp_number: settings.whatsapp_number,
        whatsapp_message: settings.whatsapp_message,
        instagram_profile_url: settings.instagram_profile_url,
        facebook_profile_url: settings.facebook_profile_url,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        cta_title: settings.cta_title,
        cta_text: settings.cta_text,
      });
      setContentData(settings.content_json || {});
    }
  }, [settings]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsUnlocked(false);
  };

  const handleSave = async () => {
    if (!session) {
      alert("You are logged in via Recovery PIN. Database writes require full Admin Login (Email/Password) due to security policies.");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .update({
        ...formData,
        content_json: contentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'main');

    if (error) {
      alert('Error saving settings: ' + error.message);
    } else {
      alert('Settings saved successfully!');
      await refreshSettings();
    }
    setIsSaving(false);
  };

  const handleAddMedia = async () => {
    if (!session) {
      alert("Database writes require full Admin Login.");
      return;
    }
    if (!newMediaUrl) {
      alert("Please provide an image/video URL");
      return;
    }

    setIsMediaSaving(true);
    const { error } = await supabase
      .from('work_media')
      .insert([{
        file_url: newMediaUrl,
        storage_path: newMediaThumbnail || null,
        caption: newMediaCaption,
        file_type: newMediaUrl.includes('.mp4') ? 'video' : 'image', // Basic inference
      }]);

    if (error) {
      alert('Error adding media: ' + error.message);
    } else {
      setNewMediaUrl('');
      setNewMediaThumbnail('');
      setNewMediaCaption('');
      await refreshSettings();
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
      alert('Error deleting media: ' + error.message);
    } else {
      await refreshSettings();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md p-4 overflow-y-auto flex items-start justify-center pt-10">
      <div className="w-full max-w-4xl bg-[#0b120e] border border-border/40 rounded-3xl shadow-2xl overflow-hidden relative mb-10">
        <div className="flex justify-between items-center p-6 border-b border-border/20 bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-white/60">Manage your Grave Care Kashmir website settings.</p>
          </div>
          <button 
            onClick={onClose}
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
              {!session && (
                <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-200 text-sm">
                  <strong>Read-Only Mode:</strong> You unlocked via Recovery PIN. You cannot save changes to the database.
                </div>
              )}
              
              <div className="flex border border-white/10 rounded-xl overflow-hidden bg-white/5 flex-wrap">
                {['general', 'social', 'copy', 'media'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-2 text-xs font-bold tracking-widest uppercase border-r border-white/10 last:border-r-0 transition-colors ${
                      activeTab === tab ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {tab === 'general' ? 'General' : tab === 'social' ? 'Socials' : tab === 'copy' ? 'Website Text' : 'Work Media'}
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
                        <input type="text" value={formData.brand_name || ''} onChange={e => setFormData({...formData, brand_name: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">WhatsApp number (with country code, e.g. 917006830501)</label>
                        <input type="text" value={formData.whatsapp_number || ''} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-white/60">WhatsApp default message</label>
                        <textarea rows={2} value={formData.whatsapp_message || ''} onChange={e => setFormData({...formData, whatsapp_message: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white mb-4">Hero Section Text</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Hero Main Title (Use a comma to split lines, e.g. "Line 1, Line 2")</label>
                        <input type="text" value={formData.hero_title || ''} onChange={e => setFormData({...formData, hero_title: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">Hero Subtitle</label>
                        <textarea rows={2} value={formData.hero_subtitle || ''} onChange={e => setFormData({...formData, hero_subtitle: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white mb-4">CTA Section Text</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">CTA Heading</label>
                        <input type="text" value={formData.cta_title || ''} onChange={e => setFormData({...formData, cta_title: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60">CTA Subtext</label>
                        <textarea rows={2} value={formData.cta_text || ''} onChange={e => setFormData({...formData, cta_text: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none" />
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
                          onChange={e => setContentData({...contentData, form_submit_method: e.target.value})}
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
                          onChange={e => setContentData({...contentData, admin_email: e.target.value})} 
                          className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm" 
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
                      <input type="text" value={formData.instagram_profile_url || ''} onChange={e => setFormData({...formData, instagram_profile_url: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60">Facebook URL</label>
                      <input type="text" value={formData.facebook_profile_url || ''} onChange={e => setFormData({...formData, facebook_profile_url: e.target.value})} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'copy' && (
                <div className="p-5 border border-primary/30 border-dashed rounded-2xl bg-primary/10 space-y-6">
                  <h3 className="text-xl text-white">Website Text Editor</h3>
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
                                  onChange={e => setContentData({...contentData, [field.key]: e.target.value})}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={contentData[field.key] || ''}
                                  onChange={e => setContentData({...contentData, [field.key]: e.target.value})}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
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
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/60">Thumbnail Image URL</label>
                        <input
                          type="text"
                          placeholder="https://... (Direct image link)"
                          value={newMediaThumbnail}
                          onChange={(e) => setNewMediaThumbnail(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-white/60">Caption (Optional)</label>
                        <input
                          type="text"
                          placeholder="Restoration at Malkhah..."
                          value={newMediaCaption}
                          onChange={(e) => setNewMediaCaption(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddMedia}
                      disabled={isMediaSaving}
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

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  Log out
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#25d366] to-[#b9ffc7] text-[#052011] font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
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
