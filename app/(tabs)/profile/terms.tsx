import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.stickyHeader}>
        <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.header}>
          <ThemedView style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.title}>Điều khoản sử dụng</ThemedText>
          </ThemedView>
        </LinearGradient>
      </View>

      {/* Phần nội dung có thể cuộn */}
      <ScrollView style={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <Section title="1. Giới thiệu">
            <Paragraph>
              Chào mừng bạn đến với Mystic - nền tảng học tập và tra cứu thông tin. Bằng việc truy cập và sử dụng ứng dụng, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.
            </Paragraph>
          </Section>

          <Section title="2. Tài khoản người dùng">
            <Paragraph>
              - Bạn phải đăng ký tài khoản để sử dụng đầy đủ tính năng của ứng dụng{'\n'}
              - Bạn có trách nhiệm bảo mật thông tin tài khoản của mình{'\n'}
              - Không được chia sẻ tài khoản cho người khác sử dụng{'\n'}
              - Mystic có quyền khóa tài khoản nếu phát hiện vi phạm
            </Paragraph>
          </Section>

          <Section title="3. Quyền sở hữu trí tuệ">
            <Paragraph>
              Tất cả nội dung trên ứng dụng Mystic bao gồm văn bản, hình ảnh, biểu tượng, và các tài liệu khác đều thuộc quyền sở hữu của Mystic hoặc các đối tác cung cấp nội dung. Nghiêm cấm sao chép, phân phối mà không được sự cho phép.
            </Paragraph>
          </Section>

          <Section title="4. Quy định sử dụng">
            <Paragraph>
              - Không đăng tải nội dung vi phạm pháp luật{'\n'}
              - Không quấy rối hoặc có hành vi tiêu cực với người dùng khác{'\n'}
              - Không tải, chia sẻ malware hoặc virus{'\n'}
              - Không khai thác lỗ hổng của hệ thống
            </Paragraph>
          </Section>

          <Section title="5. Giới hạn trách nhiệm">
            <Paragraph>
              Mystic không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, bao gồm thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc mang tính hệ quả.
            </Paragraph>
          </Section>

          <Section title="6. Thay đổi điều khoản">
            <Paragraph>
              Mystic có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Chúng tôi sẽ thông báo cho người dùng về những thay đổi quan trọng qua email hoặc thông báo trong ứng dụng.
            </Paragraph>
          </Section>

          <ThemedText style={styles.lastUpdate}>
            Cập nhật lần cuối: 22/02/2024
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <ThemedView style={styles.section}>
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    {children}
  </ThemedView>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <ThemedText style={styles.paragraph}>{children}</ThemedText>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
  scrollContent: {
    flex: 1,
    marginTop: 120, // Để tránh bị che bởi header
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9f7aea',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
  },
  lastUpdate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
}); 