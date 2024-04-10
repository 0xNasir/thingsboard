import { TestBed } from '@angular/core/testing';

import { AutheticateResolveService } from './autheticate-resolve.service';

describe('AutheticateResolveService', () => {
  let service: AutheticateResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutheticateResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
