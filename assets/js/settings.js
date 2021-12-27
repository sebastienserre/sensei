jQuery( document ).ready( function ( $ ) {
	/***** Settings Tabs *****/
	$senseiSettings = $( '#woothemes-sensei.sensei-settings' );

	function hideAllSections() {
		$senseiSettings.find( 'section' ).hide();
		$senseiSettings.find( 'a.tab' ).removeClass( 'current' );
	}

	function show( sectionId = '' ) {
		$senseiSettings.find( `section#${ sectionId }` ).show();
		$senseiSettings
			.find( `[href="#${ sectionId }"]` )
			.addClass( 'current' );
		sensei_log_event( 'settings_view', { view: sectionId } );
	}

	// Show general settings section if no section is selected in url hasn.
	const defaultSectionId = 'default-settings';
	const urlHashSectionId = window.location.hash?.replace( '#', '' );
	hideAllSections();
	if ( urlHashSectionId ) {
		window.location.hash = '';
		show( urlHashSectionId );
	} else {
		show( defaultSectionId );
	}

	$senseiSettings.find( 'a.tab' ).on( 'click', function () {
		const sectionId = $( this ).attr( 'href' )?.replace( '#', '' );
		hideAllSections();
		show( sectionId );
		return false;
	} );

	/***** Colour pickers *****/

	jQuery( '.colorpicker' ).hide();
	jQuery( '.colorpicker' ).each( function () {
		jQuery( this ).farbtastic( jQuery( this ).prev( '.color' ) );
	} );

	jQuery( '.color' ).click( function () {
		jQuery( this ).next( '.colorpicker' ).fadeIn();
	} );

	jQuery( document ).mousedown( function () {
		jQuery( '.colorpicker' ).each( function () {
			var display = jQuery( this ).css( 'display' );
			if ( display == 'block' ) {
				jQuery( this ).fadeOut();
			}
		} );
	} );
} );
