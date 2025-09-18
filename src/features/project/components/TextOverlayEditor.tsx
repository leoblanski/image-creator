import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { PresetId, getAllPresets } from '../../../core/presets';
import { BODY_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../../core/sizes';
import { borderRadius, colors, spacing, typography } from '../../../core/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Segmented } from '../../../shared/ui/Segmented';

interface TextOverlayEditorProps {
  title: string;
  body: string;
  styleId: PresetId;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  onStyleChange: (styleId: PresetId) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TextOverlayEditor: React.FC<TextOverlayEditorProps> = ({
  title,
  body,
  styleId,
  onTitleChange,
  onBodyChange,
  onStyleChange,
  onSave,
  onCancel,
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localBody, setLocalBody] = useState(body);
  const [localStyleId, setLocalStyleId] = useState(styleId);

  useEffect(() => {
    setLocalTitle(title);
    setLocalBody(body);
    setLocalStyleId(styleId);
  }, [title, body, styleId]);

  const handleSave = () => {
    if (localTitle.length === 0) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    onTitleChange(localTitle);
    onBodyChange(localBody);
    onStyleChange(localStyleId);
    onSave();
  };

  const presets = getAllPresets();
  const presetOptions = presets.map(preset => ({
    label: preset.name,
    value: preset.id,
  }));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Text Content</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Title {localTitle.length > 0 && `(${localTitle.length}/${TITLE_MAX_LENGTH})`}
            </Text>
            <TextInput
              style={styles.input}
              value={localTitle}
              onChangeText={setLocalTitle}
              placeholder="Enter slide title..."
              maxLength={TITLE_MAX_LENGTH}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Body {localBody.length > 0 && `(${localBody.length}/${BODY_MAX_LENGTH})`}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={localBody}
              onChangeText={setLocalBody}
              placeholder="Enter slide description (optional)..."
              maxLength={BODY_MAX_LENGTH}
              multiline
              numberOfLines={3}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Style Preset</Text>
          <Segmented
            options={presetOptions}
            value={localStyleId}
            onValueChange={setLocalStyleId}
            style={styles.presetSelector}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={styles.button}
        />
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily,
    color: colors.light.text,
    backgroundColor: colors.light.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  presetSelector: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  button: {
    flex: 1,
  },
});
