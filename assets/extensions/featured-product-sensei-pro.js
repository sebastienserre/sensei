/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FeaturedProduct from './featured-product';
import useSenseiProExtension from './use-sensei-pro-extension';

/*
 * Sensei Pro featured product component.
 */
const FeaturedProductSenseiPro = () => {
	const senseiProExtension = useSenseiProExtension();

	if ( ! senseiProExtension || senseiProExtension.is_installed === true ) {
		return <></>;
	}

	return (
		<FeaturedProduct
			title={ senseiProExtension.title }
			excerpt={ senseiProExtension.excerpt }
			description={ __(
				'By upgrading to Sensei Pro, you get all the great features found in Sensei LMS plus:',
				'sensei-lms'
			) }
			features={ [
				__( 'WooCommerce integration', 'sensei-lms' ),
				__( 'Schedule ‘drip’ content', 'sensei-lms' ),
				__( 'Set expiration date of courses', 'sensei-lms' ),
				__( 'Advanced quiz features', 'sensei-lms' ),
				__( 'Interactive learning blocks (coming soon)', 'sensei-lms' ),
				__( 'Premium support', 'sensei-lms' ),
			] }
			image={ senseiProExtension.image_large }
			badgeLabel={ __( 'new', 'sensei-lms' ) }
			price={ sprintf(
				// translators: placeholder is the price.
				__( '%s USD / year (1 site)', 'sensei-lms' ),
				senseiProExtension.price
			) }
			buttonLink={ sprintf(
				'https://senseilms.com/checkout?add-to-cart=%d&utm_source=plugin_sensei&utm_medium=upsell&utm_campaign=extensions_header',
				senseiProExtension.wccom_product_id
			) }
		/>
	);
};

export default FeaturedProductSenseiPro;
