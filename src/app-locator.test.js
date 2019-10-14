import appIds from './known-app-ids'
import getAppLocator from './app-locator'

const CUSTOM_APP_1 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const CUSTOM_APP_2 =
  '0x0000000000000000000000000000000000000000000000000000000000000001'

test('all known apps local', () => {
  expect(getAppLocator('local')).toEqual({
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['Finance']]: 'http://localhost:3002/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
    [appIds['Survey']]: 'http://localhost:3004/',
    [appIds['Agent']]: 'http://localhost:3005/',
    [appIds['Fundraising']]: 'http://localhost:3006/',
  })
})

test('one local app', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
  }

  expect(getAppLocator('Voting:local')).toEqual(result)
  expect(getAppLocator('Voting:')).toEqual(result)
  expect(getAppLocator('Voting')).toEqual(result)
  expect(getAppLocator(',Voting,')).toEqual(result)
  expect(getAppLocator(',Voting:,')).toEqual(result)
  expect(getAppLocator(',Voting:local,')).toEqual(result)
  expect(getAppLocator(',Voting:local,')).toEqual(result)
})

test('multiple local apps', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
  }

  expect(getAppLocator('Voting:local,TokenManager')).toEqual(result)
  expect(getAppLocator('Voting,TokenManager:,')).toEqual(result)
})

test('local port', () => {
  expect(getAppLocator('Voting:1234,TokenManager:3333')).toEqual({
    [appIds['Voting']]: 'http://localhost:1234/',
    [appIds['TokenManager']]: 'http://localhost:3333/',
  })
})

test('custom app', () => {
  const result = {
    [CUSTOM_APP_1]: 'http://example.org/',
    [CUSTOM_APP_2]: 'http://example.org:4444/',
  }

  expect(
    getAppLocator(
      `${CUSTOM_APP_1}:http://example.org/` +
        `,${CUSTOM_APP_2}:http://example.org:4444/`
    )
  ).toEqual(result)
})

test('mixed apps', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['TokenManager']]: 'http://example.com/',
    [CUSTOM_APP_1]: 'http://example.org/',
  }

  expect(
    getAppLocator(
      `Voting:local,TokenManager:http://example.com/,${CUSTOM_APP_1}:http://example.org/`
    )
  ).toEqual(result)
})
