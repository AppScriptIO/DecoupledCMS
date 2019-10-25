import { initializeGraph } from '../../../utility/graphInitialization.js'
import * as graphData from '../resource/graphData.json'

export async function graphMiddleware({ targetProjectConfig, entrypointKey = '05bd55ed-212c-4609-8caf-e464a7cceb74' }) {
  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData] })
  return createGraphMiddleware({ entrypointKey })
}
