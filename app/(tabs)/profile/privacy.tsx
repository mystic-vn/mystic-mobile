import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.stickyHeader}>
        <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.header}>
          <ThemedView style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.title}>Chính sách bảo mật</ThemedText>
          </ThemedView>
        </LinearGradient>
      </View>

      {/* Phần nội dung có thể cuộn */}
      <ScrollView style={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <Section title="1. Thông tin chúng tôi thu thập">
            <Paragraph>
              Khi bạn sử dụng Mystic, chúng tôi có thể thu thập các thông tin sau:{'\n\n'}
              - Thông tin cá nhân: tên, email, và các thông tin đăng ký{'\n'}
              - Thông tin thiết bị: loại thiết bị, hệ điều hành{'\n'}
              - Dữ liệu sử dụng: lịch sử tìm kiếm, tương tác với ứng dụng{'\n'}
              - Thông tin vị trí (nếu được cho phép)
            </Paragraph>
          </Section>

          <Section title="2. Cách chúng tôi sử dụng thông tin">
            <Paragraph>
              Chúng tôi sử dụng thông tin thu thập để:{'\n\n'}
              - Cung cấp và cải thiện dịch vụ{'\n'}
              - Cá nhân hóa trải nghiệm người dùng{'\n'}
              - Gửi thông báo về cập nhật và tính năng mới{'\n'}
              - Phân tích và tối ưu hóa hiệu suất ứng dụng
            </Paragraph>
          </Section>

          <Section title="3. Bảo mật thông tin">
            <Paragraph>
              Mystic cam kết bảo vệ thông tin của người dùng bằng các biện pháp bảo mật tiên tiến. Chúng tôi sử dụng mã hóa SSL/TLS cho việc truyền tải dữ liệu và lưu trữ thông tin an toàn trên máy chủ được bảo vệ.
            </Paragraph>
          </Section>

          <Section title="4. Chia sẻ thông tin">
            <Paragraph>
              Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong các trường hợp:{'\n\n'}
              - Khi có yêu cầu pháp lý{'\n'}
              - Với các đối tác cung cấp dịch vụ (có cam kết bảo mật){'\n'}
              - Khi được sự đồng ý của bạn
            </Paragraph>
          </Section>

          <Section title="5. Quyền của người dùng">
            <Paragraph>
              Bạn có quyền:{'\n\n'}
              - Truy cập và chỉnh sửa thông tin cá nhân{'\n'}
              - Yêu cầu xóa tài khoản{'\n'}
              - Từ chối nhận thông báo marketing{'\n'}
              - Yêu cầu báo cáo về dữ liệu của bạn
            </Paragraph>
          </Section>

          <Section title="6. Cookie và công nghệ theo dõi">
            <Paragraph>
              Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm người dùng và thu thập dữ liệu phân tích. Bạn có thể kiểm soát việc sử dụng cookie trong cài đặt ứng dụng.
            </Paragraph>
          </Section>

          <Section title="7. Thay đổi chính sách">
            <Paragraph>
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Khi có thay đổi quan trọng, chúng tôi sẽ thông báo cho bạn qua email hoặc thông báo trong ứng dụng.
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