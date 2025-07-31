import { generateMockUser } from './index.js';

export const createHandlers = async () => {
  try {
    const { http, HttpResponse } = await import('msw');
    
    return [
      http.get('https://api.yurba.one/get_me', () => {
        return HttpResponse.json(generateMockUser('123', 'me'));
      }),
      http.get('https://api.yurba.one/user/:param', ({ params }: any) => {
        const { param } = params;
        const isId = /^\d+$/.test(param);
        return HttpResponse.json(
          isId 
            ? generateMockUser(param, `user_${param}`)
            : generateMockUser('0', param)
        );
      }),
      // Dialogs
      http.get('https://api.yurba.one/dialogs', () => {
        return HttpResponse.json([{
          ID: 1,
          Name: 'Test Dialog',
          Type: 1,
          Description: 'Mock dialog'
        }]);
      }),
      http.post('https://api.yurba.one/dialogs', ({ request }: any) => {
        return HttpResponse.json({
          ID: 1,
          Name: 'Created Dialog',
          Type: 1
        });
      }),
      http.get('https://api.yurba.one/dialogs/:id/members', ({ params }: any) => {
        return HttpResponse.json([{
          ID: 1,
          UserID: 123,
          Role: 'member'
        }]);
      }),
      http.post('https://api.yurba.one/dialogs/:dialogId/join/:userId', () => {
        return HttpResponse.json({ ok: 1 });
      }),
      http.delete('https://api.yurba.one/dialogs/:dialogId/leave/:userId', () => {
        return HttpResponse.json({ ok: 1 });
      }),
    ];
  } catch {
    return [];
  }
};

export const handlers = await createHandlers();