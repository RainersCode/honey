import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Order } from '@/types';

// Function to replace Latvian diacritics with base characters for PDF compatibility
const removeDiacritics = (text: string): string => {
  if (!text) return text;
  const diacriticsMap: { [key: string]: string } = {
    'ā': 'a', 'Ā': 'A',
    'č': 'c', 'Č': 'C', 
    'ē': 'e', 'Ē': 'E',
    'ģ': 'g', 'Ģ': 'G',
    'ī': 'i', 'Ī': 'I',
    'ķ': 'k', 'Ķ': 'K',
    'ļ': 'l', 'Ļ': 'L',
    'ņ': 'n', 'Ņ': 'N',
    'š': 's', 'Š': 'S',
    'ū': 'u', 'Ū': 'U',
    'ž': 'z', 'Ž': 'Z'
  };
  
  return text.replace(/[āĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ]/g, (match) => diacriticsMap[match] || match);
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#FF7A3D',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 10,
  },
  orderInfo: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: '#FFE4D2',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    fontSize: 10,
  },
  totalText: {
    fontSize: 10,
  },
  totalTextBold: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
});

interface OrderReceiptProps {
  order: Order;
  dict: any;
}

const OrderReceipt = ({ order, dict }: OrderReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Honey Farm Ltd.</Text>
        <Text style={[styles.orderInfo, { fontSize: 10, marginBottom: 2 }]}>Premium Natural Honey & Organic Products</Text>
        <Text style={styles.orderInfo}>{removeDiacritics(dict.order.title)} #{order.userFacingId}</Text>
        <Text style={styles.orderInfo}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.orderInfo}>Payment Method: {removeDiacritics(order.paymentMethod)}</Text>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.title}>{removeDiacritics(dict.shipping.title)}</Text>
        <Text style={styles.orderInfo}>{removeDiacritics(order.shippingAddress.fullName)}</Text>
        {order.shippingAddress.deliveryMethod === 'omniva' ? (
          <>
            <Text style={styles.orderInfo}>{removeDiacritics(dict.shipping.form.omnivaLocation)}:</Text>
            <Text style={styles.orderInfo}>{removeDiacritics(order.shippingAddress.omnivaLocationDetails?.name || '')}</Text>
            <Text style={styles.orderInfo}>{removeDiacritics(order.shippingAddress.omnivaLocationDetails?.address || '')}</Text>
          </>
        ) : (
          <>
            <Text style={styles.orderInfo}>{removeDiacritics(order.shippingAddress.streetAddress)}</Text>
            <Text style={styles.orderInfo}>
              {removeDiacritics(order.shippingAddress.city)}, {order.shippingAddress.postalCode}
            </Text>
            <Text style={styles.orderInfo}>{removeDiacritics(order.shippingAddress.country)}</Text>
          </>
        )}
        <Text style={styles.orderInfo}>{order.shippingAddress.phoneNumber}</Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={[styles.title, { fontSize: 16 }]}>{removeDiacritics(dict.order.items.title)}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellHeader}>{removeDiacritics(dict.order.items.name)}</Text>
            <Text style={styles.tableCellHeader}>{removeDiacritics(dict.order.items.quantity)}</Text>
            <Text style={styles.tableCellHeader}>{removeDiacritics(dict.order.items.price)}</Text>
            <Text style={styles.tableCellHeader}>{removeDiacritics(dict.order.items.total)}</Text>
          </View>
          
          {/* Table Rows */}
          {order.orderitems?.map((item) => (
            <View key={item.productId} style={styles.tableRow}>
              <Text style={styles.tableCell}>{removeDiacritics(item.name)}</Text>
              <Text style={styles.tableCell}>{item.qty}</Text>
              <Text style={styles.tableCell}>${Number(item.price).toFixed(2)}</Text>
              <Text style={styles.tableCell}>
                ${(Number(item.price) * item.qty).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Order Summary */}
      <View style={[styles.section, styles.total]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{removeDiacritics(dict.order.summary.items)}:</Text>
          <Text style={styles.totalText}>${Number(order.itemsPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{removeDiacritics(dict.order.summary.shipping)}:</Text>
          <Text style={styles.totalText}>${Number(order.shippingPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{removeDiacritics(dict.order.summary.tax)}:</Text>
          <Text style={styles.totalText}>${Number(order.taxPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalTextBold}>{removeDiacritics(dict.order.summary.total)}:</Text>
          <Text style={styles.totalTextBold}>${Number(order.totalPrice).toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Honey Farm Ltd.</Text>
        <Text style={{ marginBottom: 3 }}>Premium Natural Honey & Organic Products</Text>
        <Text style={{ marginBottom: 3 }}>Company Registration No: LV40003987654</Text>
        <Text style={{ marginBottom: 3 }}>VAT Number: LV40003987654</Text>
        <Text style={{ marginBottom: 3 }}>Registered Address: Brīvības iela 123, Rīga, LV-1010, Latvia</Text>
        <Text style={{ marginBottom: 3 }}>Contact: info@honeyfarm.lv | Tel: +371 2612 3456</Text>
        <Text style={{ marginBottom: 5 }}>Website: www.honeyfarm.lv</Text>
        <Text style={{ fontSize: 10, marginTop: 5 }}>
          This document serves as your official purchase receipt. Please retain for warranty and return purposes.
        </Text>
        <Text style={{ fontSize: 10 }}>
          Thank you for choosing Honey Farm - Supporting sustainable beekeeping since 2023
        </Text>
      </View>
    </Page>
  </Document>
);

export default OrderReceipt; 