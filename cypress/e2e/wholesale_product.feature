Feature: Wholesale Price Functionality

  Scenario: Login with valid credentials
    Given I have an empty cart
    And I am on the login page
    When I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    Then I should be logged in successfully

  Scenario: Wholesale price is displayed for wholesale customer
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I have an empty cart
    When I open the "/product/test-product-1/" page
    Then I should see the wholesale price

  Scenario: Add product to cart as wholesale customer
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I have an empty cart
    And I open the "/product/test-product-1/" page
    Then I should see the wholesale price
    And I add the product to the cart
    Then the cart should show the same price as the wholesale price

  Scenario: Price consistency after page refresh
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I have an empty cart
    And I open the "/product/test-product-1/" page
    When I add the product to the cart
    And I refresh the cart page
    Then the cart should show the same price as the wholesale price

  Scenario: Price display for non-wholesale customer
    Given I have an empty cart
    And I am logged out
    When I open the "/product/test-product-1/" page
    Then I should see the regular or sale price only

  Scenario: Multiple products with wholesale pricing
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I have an empty cart
    And I open the "/product/test-product-1/" page
    When I add 3 products to the cart
    Then the cart should show the correct total wholesale price

  Scenario: Mixed cart (wholesale + non-wholesale products)
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I have an empty cart
    And I open the "/product/test-product-1/" page
    When I add the product to the cart
    And I open the "/product/test-product-2/" page
    And I add the product to the cart
    Then the cart should show the correct prices for all products

  Scenario: Product without wholesale price
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    When I open the "/product/test-product-2/" page
    Then I should see only the regular or sale price

  Scenario: Invalid login
    Given I am on the login page
    When I log in using "invaliduser" and "invalidpass"
    Then I should see a login error

  Scenario: Direct cart manipulation
    Given I log in using "w_customer1" and "9yvXh$ms6Sk$j&2wXTW7bsf2"
    And I open the "/product/test-product-1/" page
    When I add the product to the cart
    And I attempt to manipulate the cart contents
    Then the cart price should remain correct

  Scenario: Regular customer cannot see wholesale price
    Given I have an empty cart
    And I am on the login page
    When I log in using "customer_1" and "wR1KGU)17b0#uqGZ%c5vw4ig"
    And I open the "/product/test-product-1/" page
    Then I should not see the wholesale price
    And I should see the regular or sale price only
