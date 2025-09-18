import { colors, spacing, typography } from '@src/core/theme';
import { testOpenAIConnection } from '@src/features/project/openai';
import { Button } from '@src/shared/ui/Button';
import { Card } from '@src/shared/ui/Card';
import { Segmented } from '@src/shared/ui/Segmented';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState(
    Constants.expoConfig?.extra?.OPENAI_API_KEY || ''
  );
  const [defaultLanguage, setDefaultLanguage] = useState<'en-US' | 'pt-BR'>('en-US');
  const [defaultPreset, setDefaultPreset] = useState<'classic_black' | 'tech_blue' | 'bold_card'>('classic_black');
  const [showWatermark, setShowWatermark] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const languages = [
    { label: 'English', value: 'en-US' },
    { label: 'Português', value: 'pt-BR' },
  ];

  const presets = [
    { label: 'Classic Black', value: 'classic_black' },
    { label: 'Tech Blue', value: 'tech_blue' },
    { label: 'Bold Card', value: 'bold_card' },
  ];

  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      const isConnected = await testOpenAIConnection();
      
      if (isConnected) {
        Alert.alert('Success', 'OpenAI connection is working!');
      } else {
        Alert.alert('Error', 'Failed to connect to OpenAI. Please check your API key.');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      Alert.alert('Error', 'Failed to test connection. Please try again.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to AsyncStorage or similar
    Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your CarouselCraft experience</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>OpenAI Configuration</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>API Key</Text>
          <TextInput
            style={styles.textInput}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Your API key is stored locally and never shared.
          </Text>
        </View>

        <Button
          title={isTestingConnection ? 'Testing...' : 'Test Connection'}
          onPress={handleTestConnection}
          disabled={!apiKey.trim() || isTestingConnection}
          loading={isTestingConnection}
          variant="outline"
          style={styles.testButton}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Default Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Default Language</Text>
          <Segmented
            options={languages}
            value={defaultLanguage}
            onValueChange={(value) => setDefaultLanguage(value as 'en-US' | 'pt-BR')}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Default Style Preset</Text>
          <Segmented
            options={presets}
            value={defaultPreset}
            onValueChange={(value) => setDefaultPreset(value as any)}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.switchRow}>
          <View style={styles.switchContent}>
            <Text style={styles.switchLabel}>Show Watermark</Text>
            <Text style={styles.switchDescription}>
              Add a subtle watermark to exported images
            </Text>
          </View>
          <Switch
            value={showWatermark}
            onValueChange={setShowWatermark}
            trackColor={{ false: colors.light.border, true: colors.light.primary }}
            thumbColor={showWatermark ? colors.light.text : colors.light.textSecondary}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Build</Text>
          <Text style={styles.aboutValue}>2024.01.01</Text>
        </View>
      </Card>

      <View style={styles.footer}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.footerButton}
        />
        <Button
          title="Save Settings"
          onPress={handleSaveSettings}
          style={styles.footerButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.black,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  section: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily,
    color: colors.light.text,
    backgroundColor: colors.light.background,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  testButton: {
    marginTop: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  aboutLabel: {
    fontSize: typography.sizes.md,
    color: colors.light.text,
  },
  aboutValue: {
    fontSize: typography.sizes.md,
    color: colors.light.textSecondary,
    fontWeight: typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
