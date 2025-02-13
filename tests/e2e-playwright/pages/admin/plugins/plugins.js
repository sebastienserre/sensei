const { expect } = require( '@playwright/test' );

class PluginsPage {
	constructor( page ) {
		this.page = page;
	}

	async goTo( url ) {
		const baseUrl = process.env.WP_BASE_URL;
		const adminUrl = [ baseUrl, 'wp-admin', url ].join( '/' );
		return this.page.goto( adminUrl );
	}

	async goToPlugins() {
		return this.goTo( 'plugins.php' );
	}

	async isPluginActive( slug ) {
		return !! ( await this.findPluginAction( slug, 'deactivate' ) );
	}

	async findPluginAction( slug, action ) {
		return this.page.locator( `tr[data-slug="${ slug }"] .${ action } a` );
	}

	async findExitSurvey() {
		return this.page.waitForSelector(
			`#sensei-exit-survey-modal button:not(:disabled)`
		);
	}

	async stepIsComplete( page, label ) {
		return expect(
			page
				.locator( '.sensei-stepper__step.is-complete' )
				.locator( `text=${ label }` )
		).toHaveCount( 1 );
	}

	async closeUserTrackingModal() {
		await this.page
			.locator( '.sensei-setup-wizard__usage-modal button' )
			.locator( 'text=Continue' )
			.click();
	}

	async fillOutPurposeForm() {
		await this.page
			.locator( 'label' )
			.locator( 'text=Promote your business' )
			.click();
		await this.page.locator( 'label' ).locator( 'text=Other' ).click();
		await this.page.fill(
			'.sensei-setup-wizard__textcontrol-other input',
			'Other'
		);
	}

	async goToReadyStep() {
		await this.page
			.locator( '.sensei-stepper__step' )
			.locator( 'text=Ready' )
			.click();
	}

	async fillOutFeaturesForm() {
		return this.page
			.locator( 'label' )
			.locator( 'text=Sensei LMS Certificates' )
			.click();
	}

	async stepIsActive( page, label ) {
		return expect(
			page
				.locator( '.sensei-stepper__step.is-active' )
				.locator( `text=${ label }` )
		).toHaveCount( 1 );
	}

	async goToPluginsAndGetDeactivationLink( slug ) {
		await this.goToPlugins();

		const deactivateUrl = await this.findPluginAction( slug, 'deactivate' );
		return deactivateUrl;
	}

	async deactivatePluginByLink( deactivateLink ) {
		if ( deactivateLink ) {
			await deactivateLink.click();
			const exitSurvey = await this.findExitSurvey();
			if ( exitSurvey ) {
				await exitSurvey.click();
			}
		}
	}

	async activatePlugin( slug, forceReactivate = false ) {
		const deactivateLink = await this.goToPluginsAndGetDeactivationLink(
			slug
		);

		if ( deactivateLink ) {
			if ( forceReactivate ) {
				await this.deactivatePluginByLink( deactivateLink );
			} else {
				return;
			}
		}

		const activate = await this.findPluginAction( slug, 'activate' );
		await activate.click();
	}
}

module.exports = PluginsPage;
