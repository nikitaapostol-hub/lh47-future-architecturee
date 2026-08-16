import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // this repo is the workspace root; keeps Turbopack from walking upwards
  turbopack: { root: import.meta.dirname },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
