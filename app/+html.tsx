import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const appFontFamily = 'WorkSans_400Regular, Arial, Helvetica, sans-serif';

export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();

  return (
    <html {...htmlAttributes}>
      <head>
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
html,
body,
#root {
  font-family: ${appFontFamily};
}
`,
          }}
        />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
