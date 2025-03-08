import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TermsScreen() {
  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>1. Giới thiệu</ThemedText>
            <ThemedText style={styles.text}>
              Chào mừng bạn đến với Mystic - ứng dụng tra cứu Tarot. Bằng việc truy cập và sử dụng ứng dụng của chúng tôi, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>2. Điều kiện sử dụng</ThemedText>
            <ThemedText style={styles.text}>
              • Bạn phải từ 16 tuổi trở lên để sử dụng ứng dụng{'\n'}
              • Bạn đồng ý cung cấp thông tin chính xác khi đăng ký{'\n'}
              • Bạn chịu trách nhiệm bảo mật tài khoản của mình{'\n'}
              • Không được sử dụng ứng dụng cho mục đích bất hợp pháp
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>3. Quyền sở hữu trí tuệ</ThemedText>
            <ThemedText style={styles.text}>
              Tất cả nội dung trong ứng dụng bao gồm hình ảnh, văn bản, biểu tượng và phần mềm đều thuộc quyền sở hữu của Mystic. Bạn không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>4. Giới hạn trách nhiệm</ThemedText>
            <ThemedText style={styles.text}>
              Mystic cung cấp dịch vụ "nguyên trạng" và không đảm bảo tính chính xác tuyệt đối của các kết quả tra cứu. Chúng tôi không chịu trách nhiệm về bất kỳ quyết định nào của bạn dựa trên thông tin từ ứng dụng.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>5. Thay đổi điều khoản</ThemedText>
            <ThemedText style={styles.text}>
              Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Việc tiếp tục sử dụng ứng dụng sau khi thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>6. Liên hệ</ThemedText>
            <ThemedText style={styles.text}>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: support@mystic.vn
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