import { router } from '../imperative-api';
import { screen, testRouter, renderRouter, act } from '../testing-library';

describe('push', () => {
  /*
   * Push should always push
   * @see: https://reactnavigation.org/docs/navigating/#navigate-to-a-route-multiple-times
   */
  it('can handle navigation between routes', async () => {
    renderRouter(
      {
        page: () => null,
      },
      {
        initialUrl: 'page',
      }
    );

    testRouter.push('/page?a=true'); // New params always push
    testRouter.push('/page?b=true');
    testRouter.push('/page'); // This pushes the a new '/page'
    testRouter.push('/page'); // Duplicate pushes are allowed pushes the new '/page'
    testRouter.push('/page?c=true');

    testRouter.back('/page');
    testRouter.back('/page');
    testRouter.back('/page?b=true');
    testRouter.back('/page?a=true');
    testRouter.back('/page');

    expect(testRouter.canGoBack()).toBe(false);
  });
});

describe('navigate', () => {
  // Navigate ignores search params when routing.
  it('can handle navigation between routes', async () => {
    renderRouter(
      {
        page: () => null,
      },
      {
        initialUrl: 'page',
      }
    );

    testRouter.navigate('/page?a=true'); // This rerenders, and doesn't push
    testRouter.navigate('/page?b=true'); // This rerenders, and doesn't push
    testRouter.navigate('/page'); // This rerenders, and doesn't push
    testRouter.navigate('/page'); // This does nothing
    testRouter.navigate('/page?c=true'); // This rerenders, and doesn't push

    // There is nothing to go back, as we only re-rerendered the same route.
    expect(testRouter.canGoBack()).toBe(false);
  });

  it.skip('handles popToTop', async () => {
    // TODO: add popToTop to the router
    renderRouter(
      {
        page: () => null,
      },
      {
        initialUrl: 'page',
      }
    );

    testRouter.navigate('/page?a=true');
    testRouter.navigate('/page?b=true');
    testRouter.navigate('/page?c=true');
    (testRouter as any).popToTop('/page');

    expect(testRouter.canGoBack()).toBe(false);
  });
});

describe('replace', () => {
  it('can handle navigation between routes', async () => {
    renderRouter(
      {
        page: () => null,
      },
      {
        initialUrl: 'page',
      }
    );

    testRouter.push('/page?a=true');
    testRouter.push('/page?b=true');
    testRouter.replace('/page?a=true'); // This will clear the previous route
    testRouter.push('/page?c=true');

    testRouter.back('/page?a=true');
    testRouter.back('/page?a=true'); // It will be present twice
    testRouter.back('/page');

    expect(testRouter.canGoBack()).toBe(false);
  });
});

it('can handle search params with special characters', async () => {
  renderRouter({
    index: () => null,
  });

  act(() => router.push('/?a=(param)'));

  expect(screen).toHavePathnameWithParams('/?a=%28param%29');
  expect(screen).toHaveSearchParams({ a: '(param)' });
});
