/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Featured label wrapper component.
 *
 * @param {Object}  props
 * @param {string}  props.postId          Course id.
 * @param {boolean} props.isFeaturedImage If it is a featured image block (or course categories).
 * @param {Object}  props.children        Child component to be wrapped in Feature Label component.
 */
const FeaturedLabel = ( { postId, isFeaturedImage, children } ) => {
	const [ meta ] = useEntityProp( 'postType', 'course', 'meta', postId );
	const [ media ] = useEntityProp(
		'postType',
		'course',
		'featured_media',
		postId
	);
	const isFeatured = !! meta._course_featured;
	const hasImage = media > 0;

	const wrapperClassName = isFeaturedImage
		? 'featured-course-wrapper__featured-image'
		: 'featured-course-wrapper__course-categories';
	const featuredLabelClassName = isFeaturedImage
		? 'course-list-featured-label__featured-image'
		: 'course-list-featured-label__course-categories';

	const shouldDisplayFeatureLabel =
		( hasImage && isFeaturedImage ) || ( ! hasImage && ! isFeaturedImage );
	return (
		<div className={ wrapperClassName }>
			{ isFeatured && shouldDisplayFeatureLabel && (
				<span className={ featuredLabelClassName }>
					{ __( 'Featured', 'sensei-lms' ) }
				</span>
			) }
			{ children }
		</div>
	);
};

export default FeaturedLabel;
