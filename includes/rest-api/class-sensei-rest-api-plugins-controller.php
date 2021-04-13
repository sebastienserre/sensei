<?php
/**
 * Sensei REST API: Sensei_REST_API_Plugins_Controller class.
 *
 * @package sensei-lms
 * @since   3.11.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly.

/**
 * A REST controller for Sensei related plugins.
 *
 * @since 3.11.0
 *
 * @see   WP_REST_Controller
 */
class Sensei_REST_API_Plugins_Controller extends WP_REST_Controller {
	/**
	 * Routes namespace.
	 *
	 * @var string
	 */
	protected $namespace;

	/**
	 * Routes prefix.
	 *
	 * @var string
	 */
	protected $rest_base = 'sensei-plugins';

	/**
	 * Sensei_REST_API_Plugins_Controller constructor.
	 *
	 * @param string $namespace Routes namespace.
	 */
	public function __construct( $namespace ) {
		$this->namespace = $namespace;
	}

	/**
	 * Register the REST API endpoints for plugins.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			$this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_plugins' ],
					'permission_callback' => [ $this, 'can_user_manage_plugins' ],
					'args'                => [
						'installed'  => [
							'type'              => 'bool',
							'required'          => false,
							'sanitize_callback' => function( $param ) {
								return (bool) $param;
							},
						],
						'has_update' => [
							'type'              => 'bool',
							'required'          => false,
							'sanitize_callback' => function( $param ) {
								return (bool) $param;
							},
						],
					],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Check user permission for managing plugins.
	 *
	 * @param WP_REST_Request $request WordPress request object.
	 *
	 * @return bool|WP_Error Whether the user can manage plugins.
	 */
	public function can_user_manage_plugins( WP_REST_Request $request ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_view_plugins',
				__( 'Sorry, you are not allowed to manage plugins for this site.', 'sensei-lms' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Returns the requested plugins.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response The response which contains the plugins.
	 */
	public function get_plugins( WP_REST_Request $request ) : WP_REST_Response {
		$plugins = Sensei_Extensions::instance()->get_extensions( 'plugin' );

		$params           = $request->get_params();
		$filtered_plugins = array_filter(
			$plugins,
			function( $plugin ) use ( $params ) {
				$should_return = true;

				if ( isset( $params['installed'] ) ) {
					$should_return = $plugin->is_installed === $params['installed'];
				}

				if ( isset( $params['has_update'] ) ) {
					$should_return = isset( $plugin->has_update ) && $plugin->has_update;
				}

				return $should_return;
			}
		);

		$response = new WP_REST_Response();
		$response->set_data( array_values( $filtered_plugins ) );

		return $response;
	}

	/**
	 * Schema for the endpoint.
	 *
	 * @return array Schema object.
	 */
	public function get_item_schema() : array {
		return [
			'type'  => 'array',
			'items' => [
				'type'       => 'object',
				'properties' => [
					'hash'             => [
						'type'        => 'string',
						'description' => 'Product ID.',
					],
					'title'            => [
						'type'        => 'string',
						'description' => 'Plugin title.',
					],
					'image'            => [
						'type'        => 'string',
						'description' => 'Plugin image.',
					],
					'excerpt'          => [
						'type'        => 'string',
						'description' => 'Plugin excerpt',
					],
					'link'             => [
						'type'        => 'string',
						'description' => 'Plugin link.',
					],
					'price'            => [
						'type'        => 'string',
						'description' => 'Plugin price.',
					],
					'is_featured'      => [
						'type'        => 'boolean',
						'description' => 'Whether its a featured plugin.',
					],
					'product_slug'     => [
						'type'        => 'string',
						'description' => 'Plugin product slug.',
					],
					'hosted_location'  => [
						'type'        => 'string',
						'description' => 'Where the plugin is hosted (dotorg or external)',
					],
					'type'             => [
						'type'        => 'string',
						'description' => 'Whether this is a plugin or a theme',
					],
					'plugin_file'      => [
						'type'        => 'string',
						'description' => 'Main plugin file.',
					],
					'version'          => [
						'type'        => 'string',
						'description' => 'Plugin version.',
					],
					'wccom_product_id' => [
						'type'        => 'string',
						'description' => 'WooCommerce.com product ID.',
					],
					'is_installed'     => [
						'type'        => 'boolean',
						'description' => 'Whether the plugin is installed.',
					],
					'has_update'       => [
						'type'        => 'boolean',
						'description' => 'Whether the plugin has available updates.',
					],
				],
			],
		];
	}

}
