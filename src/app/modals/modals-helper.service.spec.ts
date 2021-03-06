import { TestBed, inject } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';

import { ModalsModule } from './modals.module';
import { CoreModule } from '../core/core.module';
import { RpcWithStateModule } from 'app/core/rpc/rpc.module';

import { ModalsHelperService } from './modals-helper.service';

describe('ModalsHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ModalsModule,
        CoreModule.forRoot(),
        RpcWithStateModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef}
      ]
    });
  });

  it('should be created', inject([ModalsHelperService], (service: ModalsHelperService) => {
    expect(service).toBeTruthy();
  }));
});
