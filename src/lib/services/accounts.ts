export function getAccounts() {
  return [
    {
      id: 'A1',
      name: 'Account Alpha',
      mode: 'attack',
      status: 'tradable',
      lives: 3,
      payoutReady: false,
    },
    {
      id: 'B1',
      name: 'Account Beta',
      mode: 'preservation',
      status: 'restricted',
      lives: 1,
      payoutReady: true,
    },
  ];
}