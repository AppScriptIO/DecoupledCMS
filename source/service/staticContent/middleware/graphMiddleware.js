import { initializeGraph } from '../../../utility/graphInitialization.js'

export async function graphMiddleware({ targetProjectConfig, entrypointKey }) {
  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig })
  return createGraphMiddleware({ entrypointKey })
}
