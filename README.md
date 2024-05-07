# ZalgEditor

A reusable [Lexical Editor](https://lexical.dev/) component, based on the [Lexical Playground](https://github.com/facebook/lexical/tree/main/packages/lexical-playground) code. It's currently intended to be used in Remix applications. It _sort of_ has a Remix dependency - its main `Composer` component requires a [`fetcher`](https://remix.run/docs/en/main/hooks/use-fetcher) prop with the type:

```
export interface CustomFetcher {
  submit: (data: FormData, options: { method: string }) => void;
}
```

The `fetcher` is used by the `SubmitPlugin` component to submit the editor's data to the route's `action` function.

Note: this is a work in progress. I'm using similar code in a couple of apps, so it made sense to extract it into a submodule.

## Development setup

The following dependencies are required. Install them through the project's `package.json` file:

- `lexical` (version ^0.14.5)
- `@lexical/react` (version ^0.14.5)

CSS classes used throughout the component assume that Tailwind CSS is installed. (I know, but otherwise this would never get finished.)

## Known issues

- formatting buttons can be clicked when the editor doesn't have focus
- links won't "autolink" if they're in brackets with no spaces between the link and the brackets.
