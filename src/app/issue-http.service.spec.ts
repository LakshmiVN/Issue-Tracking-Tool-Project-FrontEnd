import { TestBed } from '@angular/core/testing';

import { IssueHttpService } from './issue-http.service';

describe('IssueHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueHttpService = TestBed.get(IssueHttpService);
    expect(service).toBeTruthy();
  });
});
