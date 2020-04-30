# Acceptance Test Design Principles

- Abstract - amplification of the essential and elimination of the irrelevant
- Bona Fide - "with good intend", test client (BDD) is close to production client, neg. example: test client inaccurately implements features -> lost faith into the tests
- Cohesive - Tests should demonstrate a single goal (how strongly elements within a given module relate to one another, tests with high cohesion are short and to the point)
- Decoupled - Tests should not depend on the results of other tests
- Expressive - Ensure all parties can understand each test as a standalone document of behavior
- Free of Duplication - Minimize duplication across tests
- Green - passing acceptance tests should provide you with high levels of confidence that you can ship your software

_(source: https://www.ranorex.com/blog/abcs-acceptance-test-design/ & http://agileinaflash.blogspot.com/2010/07/acceptance-test-design-principles.html)_

## Definition of Acceptance Tests

- All tests are automated
- Document all uses of the system
- Don't just cover "happy paths"
- Do not replace exploratory tests
- Run in a near-production environment
- Are also defined by the customer

_(source: http://agileinaflash.blogspot.com/2009/06/acceptance-tests.html)_

## Tripple-A Pattern (AAA)

- Arrange
- Act
- Assert

_(source: http://agileinaflash.blogspot.com/2009/03/arrange-act-assert.html)_
