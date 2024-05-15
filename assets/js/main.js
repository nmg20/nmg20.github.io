/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

window.addEventListener('load', function() {
	// Array of image URLs to preload
	var imageUrls = [
		'../../images/overlay.png',
		'../../images/cies.jpg',
		'../../images/cies_dark.jpg'
	];

	// Function to preload images
	function preloadImages(urls) {
		urls.forEach(function(url) {
			var img = new Image();
			img.src = url;
		});
	}

	// Preload images
	preloadImages(imageUrls);

	// Your other JavaScript code here
});

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);





/* function toggleProjectDetails(button) {
    var project = button.closest('.project');

    // Toggle expanded state
    project.classList.toggle('expanded');

    var projectContent = project.querySelector('.project-content');
    var projectDetails = project.querySelector('.project-details');
    var showMoreButton = project.querySelector('.show-more-button');

    if (project.classList.contains('expanded')) {
        // Expand project details
        projectContent.style.display = 'none';
        projectDetails.style.display = 'block';
        showMoreButton.textContent = 'Show Less';
    } else {
        // Collapse project details
        projectContent.style.display = 'flex';
        projectDetails.style.display = 'none';
        showMoreButton.textContent = 'Show More';
    }
} */

/********/

// document.querySelectorAll('.more-info-button').forEach(function(button) {
// 	button.addEventListener('click', function() {
// 		var project = this.parentElement;
// 		var expandedInfo = project.querySelector('.expanded-info');
// 		expandedInfo.style.display = 'block';
// 		project.style.width = '100%';
// 	});
// });

// document.querySelectorAll('.less-info-button').forEach(function(button) {
// 	button.addEventListener('click', function() {
// 		var project = this.parentElement.parentElement;
// 		var expandedInfo = this.parentElement;
// 		expandedInfo.style.display = 'none';
// 		project.style.width = 'auto';
// 	});
// });

/* function expandirColumna(index) {
    const columnas = document.querySelectorAll('.columna');
    const boton = columnas[index].querySelector('.boton-mas');
    const textoOriginal = columnas[index].querySelector('.brief-text');
    const textoExpandido = columnas[index].querySelector('.alt-text');
    const verPdfLink = columnas[index].querySelector('.link-button');

    if (boton.textContent === 'Mostrar más') {
        columnas[index].classList.add('expandido'); // Aplicar la clase de expansión
        boton.textContent = 'Mostrar menos'; // Cambiar el texto del botón a "Menos"
        columnas[(index+1)%2].classList.add('oculto'); // Ocultar la segunda columna
        textoOriginal.style.display = 'none';
        textoExpandido.style.display = 'block';
        verPdfLink.style.display = 'block'; // Mostrar el enlace "Ver PDF"
    } else {
        columnas[index].classList.remove('expandido'); // Remover la clase de expansión
        boton.textContent = 'Mostrar más'; // Cambiar el texto del botón a "Más"
        columnas[(index+1)%2].classList.remove('oculto'); // Mostrar la segunda columna
        textoOriginal.style.display = 'block';
        textoExpandido.style.display = 'none';
        verPdfLink.style.display = 'none'; // Ocultar el enlace "Ver PDF"
    }

    // const otraColumnaIndex = index === 0 ? 1 : 0;
    // columnas[otraColumnaIndex].classList.remove('expandido'); // Asegurar que la otra columna esté contraída
} */

// function expandirColumna(index) {
//     const columnas = document.querySelectorAll('.columna');
//     const boton = columnas[index].querySelector('.boton-mas');
//     const verPdfLink = columnas[index].querySelector('.link-button');

//     if (boton.textContent === 'Más') {
//         // Expande la columna
//         columnas.forEach((columna, i) => {
//             if (i === index) {
//                 columna.classList.add('expandido');
//             } else {
//                 columna.classList.remove('expandido');
//             }
//         });
//         // Cambia el texto del botón
//         boton.textContent = 'Menos';
//         // Muestra el enlace "Ver PDF"
//         verPdfLink.style.display = 'inline'; // Mostrar como un enlace
//     } else {
//         // Contrae la columna
//         columnas[index].classList.remove('expandido');
//         // Restaura el texto del botón
//         boton.textContent = 'Más';
//         // Oculta el enlace "Ver PDF"
//         verPdfLink.style.display = 'none';
//     }
// }

function expandirColumna(boton) {
    const columna = boton.closest('.columna');
    const columnasContainer = columna.closest('.container');
    const columnas = columnasContainer.querySelectorAll('.columna');
    const index = Array.from(columnas).indexOf(columna);
    const otraColumnaIndex = (index + 1) % 2;

    const toggleExpandido = () => {
        columna.classList.toggle('expandido');
        boton.textContent = columna.classList.contains('expandido') ? 'Mostrar menos' : 'Mostrar más';
    };

    const toggleOculto = () => {
        columnas[otraColumnaIndex].classList.toggle('oculto');
    };

    const toggleTextos = () => {
        const textoOriginal = columna.querySelector('.brief-text');
        const textoExpandido = columna.querySelector('.alt-text');
        const verPdfLink = columna.querySelector('.link-button');
        textoOriginal.style.display = columna.classList.contains('expandido') ? 'none' : 'block';
        textoExpandido.style.display = columna.classList.contains('expandido') ? 'block' : 'none';
        verPdfLink.style.display = columna.classList.contains('expandido') ? 'block' : 'none';
    };

    toggleExpandido();
    toggleOculto();
    toggleTextos();
}