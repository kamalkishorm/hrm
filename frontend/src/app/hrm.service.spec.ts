import { TestBed } from '@angular/core/testing';

import { HrmService } from './hrm.service';

describe('HrmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HrmService = TestBed.get(HrmService);
    expect(service).toBeTruthy();
  });
});
