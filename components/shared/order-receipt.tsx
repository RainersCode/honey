import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Order } from '@/types';

// Register a default font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

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
    fontFamily: 'Roboto',
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
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#FFE4D2',
  },
  tableCell: {
    flex: 1,
    padding: 5,
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
    marginVertical: 5,
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
        <Text style={styles.title}>Honey Farm</Text>
        <Text style={styles.orderInfo}>{dict.order.title} #{order.userFacingId}</Text>
        <Text style={styles.orderInfo}>{new Date(order.createdAt).toLocaleDateString()}</Text>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.title}>{dict.shipping.title}</Text>
        <Text style={styles.orderInfo}>{order.shippingAddress.fullName}</Text>
        {order.shippingAddress.deliveryMethod === 'omniva' ? (
          <>
            <Text style={styles.orderInfo}>{dict.shipping.form.omnivaLocation}:</Text>
            <Text style={styles.orderInfo}>{order.shippingAddress.omnivaLocationDetails?.name}</Text>
            <Text style={styles.orderInfo}>{order.shippingAddress.omnivaLocationDetails?.address}</Text>
          </>
        ) : (
          <>
            <Text style={styles.orderInfo}>{order.shippingAddress.streetAddress}</Text>
            <Text style={styles.orderInfo}>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Text>
            <Text style={styles.orderInfo}>{order.shippingAddress.country}</Text>
          </>
        )}
        <Text style={styles.orderInfo}>{order.shippingAddress.phoneNumber}</Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.title}>{dict.order.items.title}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>{dict.order.items.name}</Text>
            <Text style={styles.tableCell}>{dict.order.items.quantity}</Text>
            <Text style={styles.tableCell}>{dict.order.items.price}</Text>
            <Text style={styles.tableCell}>{dict.order.items.total}</Text>
          </View>
          
          {/* Table Rows */}
          {order.orderitems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
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
          <Text>{dict.order.summary.items}:</Text>
          <Text>${Number(order.itemsPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>{dict.order.summary.shipping}:</Text>
          <Text>${Number(order.shippingPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>{dict.order.summary.tax}:</Text>
          <Text>${Number(order.taxPrice).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>{dict.order.summary.total}:</Text>
          <Text style={{ fontWeight: 'bold' }}>${Number(order.totalPrice).toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your purchase!</Text>
        <Text>Honey Farm - Pure Natural Honey</Text>
      </View>
    </Page>
  </Document>
);

export default OrderReceipt; 