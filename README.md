This is a white-label [Marketplace](https://www.marketplace-imx.rippin.io/) code repository built with [Next.js](https://nextjs.org/docs/getting-started), [Tailwind](https://tailwindcss.com/docs/installation), and [IMX](https://docs.x.immutable.com/). The marketplace is built with core features to enable a seamless trading experience.

## Marketplace Summary
Your marketplace <i>users</i> can:
- Register to IMX
- Connect with Metamask, WalletConnect, or Email (Beta)
- View NFTs
- List NFTs for sale
- Purchase NFTs
- Transfer NFTs
- View balances
- Deposit crypto
- Search NFTs with Metadata Filtering
- View NFT's transaction history
- Trade on mobile browsers
- Toggle theme modes

Your <i>developers</i> can:
- Quickly bootstrap an IMX-integrated marketplace
- Easily customize and incorporate new design system
- Easily setup testnet and production environments
- Configure marketplace maker royalties

## Getting Started

First, install project dependencides:

```bash
yarn
```

Next, set up your local environment variables by creating a `.env.local` file in the project's root folder:

```bash
touch .env.local
```

And copy paste the following [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables):

```bash
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_TOKEN_ADDRESS=0xacb3c6a43d15b907e8433077b6d38ae40936fe2c
NEXT_PUBLIC_COLLECTION_NAME="Gods Unchained"
NEXT_PUBLIC_IMX_ENV="PRODUCTION"
NEXT_PUBLIC_MARKETPLACE_ROYALTY_ADDRESS=0xf57e7e7c23978c3caec3c3548e3d615c346e79ff
NEXT_PUBLIC_MARKETPLACE_ROYALTY_PERCENTAGE=2
ANALYZE=false
NEXT_PUBLIC_BASE_PATH=localhost:3000
```

> :warning: The above configuration points to the production environment for [Gods Unchained](https://market.immutable.com/collections/0xacb3c6a43d15b907e8433077b6d38ae40936fe2c) since that collection has sufficient data to thoroughly test the repository.

Next, run the project locally:


```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the project by modifying your `.env.local` to match the configuration of your own NFT collection. Restart the server for the changes to take effect. Be sure to update the `NEXT_PUBLIC_MARKETPLACE_ROYALTY_ADDRESS` value to your project's treasury address to collect marketplace royalties.

## Project Notes

#### Components
For the frontend components, this project lightly uses [Headless UI](https://headlessui.com/), an unstyled component library, for state-heavy components like Menus and Tabs. Every other component is built with HTML and styled using Tailwind's utility classes. 

#### Styling
This project uses abstract utility-first class names as opposed to semantic class names. Component styling heavy relies on the CSS variables stored in `styles/theme.css`. Those CSS variables are used to extend the default theme in the `tailwind.config.js` file. For more information, visit [here](https://tailwindcss.com/docs/theme#extending-the-default-theme).

Light and dark theme modes are toggled by setting and un-setting the `.dark` CSS class on the application's document node. This is possible because light and dark CSS variables are nested under the `root` and `.dark` CSS classes in the `styles/theme.css` file.

To make changes to the application's design system, edit the color and size values of the CSS variables located in `styles/theme.css`. To add new custom utility classes, create a new CSS variable and reference it in `tailwind.config.js`.

#### Connect Wallet / Wallet SDK
The marketplace currently supports `MetaMask` and `WalletConnect` as its wallet providers. You will need to supply your own RPC URL to support `WalletConnect` when initializing the Wallet SDK in the `/helpers/imx.ts > buildWalletSDK` function. More information [here](https://docs.x.immutable.com/sdk-docs/wallet-sdk-web/quickstart).

When connecting a user, the user will be prompted to sign a message with their wallet provider. Upon successful connection, the user will also sign a message to be registered to the IMX platform. Registration is a pre-requisite to interacting in the IMX platform.

#### IMX Core SDK
The IMX Core SDK is initialized in the `helpers/imx.ts` file and the `client` object can be used anywhere in the application to read and write data. When writing data, please make sure the user is connected to IMX and a `WalletConnection` is available to sign messages.

#### State Management
The application uses React's `Context` API combined with `useReducer` to store and pass down data to its consumers. You can find a list of providers in the `/providers` folder along with its state type. As an example, the user's address is fetched and stored into the UserContext after successfully connecting his/her wallet. To access that property, simply destructure the `address` property from the context state like so:

```jsx
import { useUser } from '@/providers'

const {
  state: { address },
  } = useUser();
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
