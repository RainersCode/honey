import { Img } from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

// For email clients, we need to use an absolute URL that is publicly accessible
// Using Google Drive direct link format for the image
const LOGO_URL =
  'https://drive.google.com/uc?export=view&id=1_nMTFE7hsOIxf6oSR-44DEsV9lah_3SU';

export const EmailLogo = () => {
  return (
    <Img
      src={LOGO_URL}
      width='120'
      height='120'
      alt={`${APP_NAME} logo`}
      className='mx-auto'
    />
  );
};
