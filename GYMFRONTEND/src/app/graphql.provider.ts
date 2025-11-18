import { Provider } from '@angular/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';

export function provideApollo(): Provider[] {
  return [
    Apollo, 
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        link: httpLink.create({ uri: 'http://localhost:5000/graphql' }),
        cache: new InMemoryCache(),
      }),
      deps: [HttpLink],
    },
  ];
}
