/**
 * Avoid displaying the unit tests runner on github pages documentation.
 * @see https://jobandtalent.github.io/nevada/
 */
if (location.href.indexOf('github.io') > -1) {
  document.querySelector('a[href="../js-unit-tests.html"]').style.display = 'none';
}
