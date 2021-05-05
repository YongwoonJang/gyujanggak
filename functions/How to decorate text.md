# How to decorate text(React.js)

## Desire 

If I want to change font then.

## Requirements(Desire require)

1. Define font style

2. Import font style definition

3. Apply font to text

## Condition(Requirements should be instiated)

1. Definition file.

    - insert

        ```css
        .headingXl {
            font-size: 2rem;
            line-height: 1.3;
            font-weight: 800;
            letter-spacing: -0.05rem;
            margin: 1rem 0;
        }
        ```

        into

        ```javascript
        app/nextjs-blog/styles/utils.module.css
        ```

2. Import file to the page to be changed 

    - Insert 

      ```javascript
      import utilStyle from 'app/nextjs-blog/styles/utils.module.css
      ```

      into

      ```javascript
      app/nextjs-blog/pages/posts/[id].js
      ```

3. Find font to apply text

    - Insert

      ```html
      <div className={utilStype.headingXl}>text</div>
      ```

      into

      ```javascript
      app/next-js-blog/pages/posts/[id].js
      ```
