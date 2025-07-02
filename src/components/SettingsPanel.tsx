import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  settings: any;
  onSettingsUpdate: (settings: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsUpdate }) => {
  const [formData, setFormData] = useState({
    openaiApiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        openaiApiKey: settings.openaiApiKey || '',
        model: settings.model || 'gpt-3.5-turbo',
        temperature: settings.temperature || 0.7,
        maxTokens: settings.maxTokens || 1000,
        systemPrompt: settings.systemPrompt || ''
      });
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'temperature' || name === 'maxTokens' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSettingsUpdate(formData);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setFormData({
      openaiApiKey: formData.openaiApiKey, // Keep API key
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: `You are DeskMate, an intelligent desktop assistant. You help users with various tasks including:
- Answering questions and providing information
- Helping with productivity and organization
- Providing coding assistance and technical support
- Managing reminders and tasks
- System-level assistance

Be concise, helpful, and friendly. Always aim to provide actionable advice.`
    });
  };

  const isFormValid = formData.openaiApiKey.trim() !== '';

  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3>🔑 API Configuration</h3>
        
        <div className="form-group">
          <label htmlFor="openaiApiKey">OpenAI API Key</label>
          <input
            type="password"
            id="openaiApiKey"
            name="openaiApiKey"
            value={formData.openaiApiKey}
            onChange={handleInputChange}
            placeholder="sk-..."
            className="form-control"
          />
          <div className="form-description">
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>🤖 AI Model Settings</h3>
        
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, cheaper)</option>
            <option value="gpt-4">GPT-4 (More capable, slower)</option>
            <option value="gpt-4-turbo-preview">GPT-4 Turbo (Latest, balanced)</option>
          </select>
          <div className="form-description">
            Choose the AI model for responses. GPT-4 is more capable but costs more.
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="temperature">
            Temperature: {formData.temperature}
          </label>
          <input
            type="range"
            id="temperature"
            name="temperature"
            min="0"
            max="2"
            step="0.1"
            value={formData.temperature}
            onChange={handleInputChange}
            className="form-control"
          />
          <div className="form-description">
            Controls randomness. Lower values = more focused, higher values = more creative.
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="maxTokens">Max Tokens</label>
          <input
            type="number"
            id="maxTokens"
            name="maxTokens"
            min="100"
            max="4000"
            step="100"
            value={formData.maxTokens}
            onChange={handleInputChange}
            className="form-control"
          />
          <div className="form-description">
            Maximum length of AI responses. Higher values allow longer responses but cost more.
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>💬 System Prompt</h3>
        
        <div className="form-group">
          <label htmlFor="systemPrompt">Custom Instructions</label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            value={formData.systemPrompt}
            onChange={handleInputChange}
            placeholder="Enter custom instructions for the AI assistant..."
            className="form-control"
            rows={8}
          />
          <div className="form-description">
            Define how the AI should behave and what role it should take.
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>⚡ Quick Actions</h3>
        
        <div className="quick-actions">
          <button
            onClick={handleResetToDefaults}
            className="action-button secondary"
          >
            🔄 Reset to Defaults
          </button>
          
          <button
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.showNotification(
                  'Keyboard Shortcuts',
                  'Cmd+Shift+Space: Voice command\nCmd+Shift+D: Toggle window'
                );
              }
            }}
            className="action-button secondary"
          >
            ⌨️ Show Shortcuts
          </button>
        </div>
      </div>

      <div className="settings-actions">
        <button
          onClick={handleSave}
          disabled={!isFormValid || isSaving}
          className="save-button"
        >
          {isSaving ? (
            <>
              <div className="loading"></div>
              Saving...
            </>
          ) : (
            <>
              💾 Save Settings
            </>
          )}
        </button>
        
        {!isFormValid && (
          <div className="validation-error">
            ⚠️ Please enter your OpenAI API key to use AI features.
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel; 