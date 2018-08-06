import { TestBed, inject } from '@angular/core/testing';

import { ChannelMembershipService } from './channel-membership.service';

describe('ChannelMembershipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelMembershipService]
    });
  });

  it('should be created', inject([ChannelMembershipService], (service: ChannelMembershipService) => {
    expect(service).toBeTruthy();
  }));
});
