import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Global variables
let wholesalePrice = null;

Given("I am on the login page", () => {
  cy.visit("/my-account/");
});

Given('I log in using {string} and {string}', (username, password) => {
  cy.visit("/my-account/");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').contains("Log in").click();
  cy.contains("My account").should("exist");
  cy.log(`Logged in with username: ${username}`);
});

Given("I am logged out", () => {
  cy.visit("/my-account/");
  cy.get('body').then($body => {
    if ($body.text().includes('Log out')) {
      cy.contains('Log out').click();
    }
  });
});

Given("I have an empty cart", () => {
  cy.visit("/cart/");
  cy.wait(2000); // Wait for cart to load
  
  function removeAllCartItems() {
    cy.get('body').then($body => {
      if ($body.find('button.wc-block-cart-item__remove-link').length) {
        cy.get('button.wc-block-cart-item__remove-link').then($els => {
          if ($els.length) {
            cy.wrap($els[0]).click({ force: true });
            cy.wait(1000);
            removeAllCartItems();
          }
        });
      }
    });
  }
  removeAllCartItems();
});


When('I open the {string} page', (pageUrl) => {
  cy.visit(pageUrl);
  cy.log(`Opened page: ${pageUrl}`);
});

When('I add {int} products to the cart', (quantity) => {
  if (quantity > 1) {
    cy.get('input.qty').clear().type(quantity.toString());
  }
  cy.get('button.single_add_to_cart_button').click();
  cy.log(`Added ${quantity} products to cart`);
});

When("I add the product to the cart", () => {
  cy.get('button.single_add_to_cart_button').click();
});

When("I refresh the cart page", () => {
  cy.visit("/cart/");
  cy.reload();
});

When("I attempt to manipulate the cart contents", () => {
  cy.window().then(win => {
    win.localStorage.setItem('cart', 'tampered');
  });
  cy.reload();
});

Then("I should be logged in successfully", () => {
  cy.contains("My account").should("exist");
});

Then("I should see a login error", () => {
  cy.contains("Error").should("exist");
});

Then("I should see the wholesale price", () => {
  cy.get('.wholesale_price_container ins .woocommerce-Price-amount').first().invoke('text').then((text) => {
    wholesalePrice = text.trim();
    cy.log(`Wholesale Price: ${wholesalePrice}`);
    expect(wholesalePrice).to.match(/\d+[.,]?\d*/);
  });
});

Then("I should not see the wholesale price", () => {
  cy.get('.wholesale_price_container').should('not.exist');
  cy.log('Verified: Wholesale price container is not visible for regular customer');
});

Then("I should see the regular or sale price only", () => {
  cy.get('.wp-block-woocommerce-product-price[data-is-descendent-of-single-product-template="true"]').within(() => {
    cy.get('.wholesale_price_container').should('not.exist');
    cy.get('ins .woocommerce-Price-amount').should('exist');
  });
});

Then("I should see only the regular or sale price", () => {
  cy.get('.wp-block-woocommerce-product-price[data-is-descendent-of-single-product-template="true"]').within(() => {
    cy.get('.wholesale_price_container').should('not.exist');
    cy.get('ins .woocommerce-Price-amount').should('exist');
  });
});

Then("the cart should show the same price as the wholesale price", () => {
  cy.visit("/cart/");
  cy.get('.wc-block-components-totals-footer-item-tax-value').first().should('exist').invoke('text').then((cartPrice) => {
    expect(cartPrice.trim()).to.eq(wholesalePrice);
  });
});

Then("the cart should show the correct total wholesale price", () => {
  cy.visit("/cart/");
  cy.get('span.wc-block-components-product-price__value').then($items => {
    const itemPrices = [];
    $items.each((i, el) => {
      const priceText = Cypress.$(el).text().trim();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price)) itemPrices.push(price);
      }
    });
    cy.log('Cart item prices: ' + JSON.stringify(itemPrices));
    const sum = itemPrices.reduce((a, b) => a + b, 0);
    cy.get('.wc-block-components-totals-footer-item-tax-value').first().invoke('text').then(totalText => {
      const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
      cy.log(`Cart total: ${total}, Sum of items: ${sum}`);
      expect(total).to.be.closeTo(sum, 0.01);
    });
  });
});

Then("the cart should show the correct prices for all products", () => {
  cy.visit("/cart/");
  cy.get('span.wc-block-components-product-price__value').then($items => {
    const itemPrices = [];
    $items.each((i, el) => {
      const priceText = Cypress.$(el).text().trim();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price)) itemPrices.push(price);
      }
    });
    cy.log('Cart item prices: ' + JSON.stringify(itemPrices));
    const sum = itemPrices.reduce((a, b) => a + b, 0);
    cy.get('.wc-block-components-totals-footer-item-tax-value').first().invoke('text').then(totalText => {
      const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
      cy.log(`Cart total: ${total}, Sum of items: ${sum}`);
      expect(total).to.be.closeTo(sum, 0.01);
    });
  });
});

Then("the cart price should remain correct", () => {
  cy.visit("/cart/");
  cy.get('.wc-block-components-totals-footer-item-tax-value').first().should('exist');
});
