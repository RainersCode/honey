import { Column, Row, Section, Text, Img } from '@react-email/components';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { EmailLayout } from './components/email-layout';

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

type OrderInformationProps = {
  order: Order;
};

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <EmailLayout previewText={`Order Confirmation ${order.id}`}>
      <div>
        <h1 className='text-2xl font-serif text-[#1D1D1F] mb-6 text-center'>
          Thank You for Your Order!
        </h1>

        {/* Order Info */}
        <div className='bg-[#FFF8F3] rounded-lg p-4 mb-8'>
          <Row>
            <Column>
              <Text className='text-[#666666] text-sm mb-1'>Order ID</Text>
              <Text className='text-[#1D1D1F] font-medium'>
                {order.userFacingId}
              </Text>
            </Column>
            <Column>
              <Text className='text-[#666666] text-sm mb-1'>Purchase Date</Text>
              <Text className='text-[#1D1D1F] font-medium'>
                {dateFormatter.format(order.createdAt)}
              </Text>
            </Column>
            <Column>
              <Text className='text-[#666666] text-sm mb-1'>Total Paid</Text>
              <Text className='text-[#1D1D1F] font-medium'>
                {formatCurrency(order.totalPrice)}
              </Text>
            </Column>
          </Row>
        </div>

        {/* Shipping Address */}
        <div className='mb-8'>
          <h2 className='text-lg font-serif text-[#1D1D1F] mb-3'>
            Shipping Address
          </h2>
          <div className='bg-[#FFF8F3] rounded-lg p-4'>
            <Text className='text-[#1D1D1F] m-0'>
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.streetAddress}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </Text>
          </div>
        </div>

        {/* Order Items */}
        <div className='mb-8'>
          <h2 className='text-lg font-serif text-[#1D1D1F] mb-3'>
            Order Items
          </h2>
          <div className='space-y-4'>
            {order.orderitems.map((item) => (
              <Row key={item.productId} className='bg-[#FFF8F3] rounded-lg p-4'>
                <Column className='w-20'>
                  <Img
                    src={
                      item.image.startsWith('/')
                        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                        : item.image
                    }
                    width='80'
                    height='80'
                    alt={item.name}
                    className='rounded-md'
                  />
                </Column>
                <Column className='align-top flex-1'>
                  <Text className='text-[#1D1D1F] font-medium m-0'>
                    {item.name}
                  </Text>
                  <Text className='text-[#666666] text-sm m-0'>
                    Quantity: {item.qty}
                  </Text>
                </Column>
                <Column align='right' className='align-top'>
                  <Text className='text-[#1D1D1F] font-medium m-0'>
                    {formatCurrency(item.price)}
                  </Text>
                </Column>
              </Row>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className='border-t border-[#FFE4D2] pt-6'>
          <h2 className='text-lg font-serif text-[#1D1D1F] mb-3'>
            Order Summary
          </h2>
          <div className='space-y-2'>
            {[
              { name: 'Items Subtotal', price: order.itemsPrice },
              { name: 'Shipping', price: order.shippingPrice },
              { name: 'Tax', price: order.taxPrice },
              { name: 'Total', price: order.totalPrice, isTotal: true },
            ].map(({ name, price, isTotal }) => (
              <Row key={name} className='py-1'>
                <Column>
                  <Text
                    className={`m-0 ${isTotal ? 'font-medium text-[#1D1D1F]' : 'text-[#666666]'}`}
                  >
                    {name}
                  </Text>
                </Column>
                <Column align='right'>
                  <Text
                    className={`m-0 ${isTotal ? 'font-medium text-[#1D1D1F]' : 'text-[#666666]'}`}
                  >
                    {formatCurrency(price)}
                  </Text>
                </Column>
              </Row>
            ))}
          </div>
        </div>
      </div>
    </EmailLayout>
  );
}
