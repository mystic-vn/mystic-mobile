import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function PrivacyScreen() {
  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>1. Thu thập thông tin</ThemedText>
            <ThemedText style={styles.text}>
              Chúng tôi thu thập các thông tin sau khi bạn cung cấp:{'\n\n'}
              • Thông tin cá nhân: tên, email{'\n'}
              • Thông tin thiết bị và trình duyệt{'\n'}
              • Lịch sử tra cứu và tương tác{'\n'}
              • Dữ liệu phân tích việc sử dụng ứng dụng
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>2. Sử dụng thông tin</ThemedText>
            <ThemedText style={styles.text}>
              Chúng tôi sử dụng thông tin thu thập để:{'\n\n'}
              • Cung cấp và cải thiện dịch vụ{'\n'}
              • Cá nhân hóa trải nghiệm người dùng{'\n'}
              • Gửi thông báo về cập nhật và tính năng mới{'\n'}
              • Phân tích và tối ưu hiệu suất ứng dụng
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>3. Bảo mật thông tin</ThemedText>
            <ThemedText style={styles.text}>
              Chúng tôi cam kết bảo vệ thông tin của bạn bằng các biện pháp bảo mật tiên tiến. Tất cả dữ liệu được mã hóa và lưu trữ an toàn trên máy chủ được bảo vệ.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>4. Chia sẻ thông tin</ThemedText>
            <ThemedText style={styles.text}>
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ khi:{'\n\n'}
              • Được sự đồng ý của bạn{'\n'}
              • Cần thiết để cung cấp dịch vụ{'\n'}
              • Theo yêu cầu của pháp luật
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>5. Quyền của người dùng</ThemedText>
            <ThemedText style={styles.text}>
              Bạn có quyền:{'\n\n'}
              • Truy cập thông tin cá nhân{'\n'}
              • Yêu cầu chỉnh sửa thông tin{'\n'}
              • Xóa tài khoản và dữ liệu{'\n'}
              • Từ chối nhận thông báo marketing
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>6. Liên hệ</ThemedText>
            <ThemedText style={styles.text}>
              Nếu bạn có thắc mắc về chính sách bảo mật, vui lòng liên hệ:{'\n'}
              Email: privacy@mystic.vn{'\n'}
              Điện thoại: 1900 xxxx
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.updateDate}>
            Cập nhật lần cuối: 15/03/2024
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9f7aea',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  updateDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
}); 