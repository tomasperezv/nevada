'use strict';

import assert from 'assert';
import ERBTemplating from '../../src/javascript/erb-templating';

/**
 * @test {ERBTemplating}
 */
describe('ERBTemplating', () => {
  /**
   * @test {ERBTemplating#filter}
   */
  it('Filter individual strings', () => {
    assert.equal(ERBTemplating.filter('<%= t("cookie_consent.find_out_more") %>'), 'Find Out More');
    assert.equal(ERBTemplating.filter('<%= t("cookie_consent.cookies_explanation") %>'),
      'Cookies Explanation');
    assert.equal(ERBTemplating.filter(
      '<%= link_to t("cookie_consent.find_out_more"), cookies_path, target: "_blank" %>'),
      '<a href="cookies_path" target="_blank">Find Out More</a>');
    assert.equal(ERBTemplating.filter('<%= NO MATCH %>'), 'NO MATCH');
  });

  /**
   * @test {ERBTemplating#filter}
   */
  it('Filter templates with multiple matches', () => {
    const template = `<p class="landing_cookie_explanation">
      <%= t("cookie_consent.cookies_explanation") %>
      <%= t("cookie_consent.cookies_extra") %>
      <%= link_to t("cookie_consent.find_out_more"), cookies_path, target: "_blank" %>
    </p>`;

    const expected = `<p class="landing_cookie_explanation">
      Cookies Explanation
      Cookies Extra
      <a href="cookies_path" target="_blank">Find Out More</a>
    </p>`;
    assert.equal(ERBTemplating.filter(template), expected);
  });

  /**
   * @test {ERBTemplating#_replaceMatches}
   */
  it('Replacing placeholders with matches', () => {
    assert.equal(ERBTemplating._replaceMatches('[1]', ['test']), 'test');
    assert.equal(
      ERBTemplating._replaceMatches('<a href="[1]">[2]</a>', ['href', 'text']),
      '<a href="href">text</a>');
  });
});
