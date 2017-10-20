import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  DoCheck,
  ElementRef,
  HostListener,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Log } from 'ng2-logger'

import { ModalsService } from './modals.service';

import { CreateWalletComponent } from './createwallet/createwallet.component';
import { ColdstakeComponent } from './coldstake/coldstake.component';
import { DaemonComponent } from './daemon/daemon.component';
import { SyncingComponent } from './syncing/syncing.component';
import { UnlockwalletComponent } from './unlockwallet/unlockwallet.component';
import { EncryptwalletComponent } from './encryptwallet/encryptwallet.component';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
  entryComponents: [
    CreateWalletComponent,
    ColdstakeComponent,
    DaemonComponent,
    SyncingComponent,
    UnlockwalletComponent,
    EncryptwalletComponent
  ]
})
export class ModalsComponent implements DoCheck, OnInit {

  // @ViewChild('staticModal')
  // public staticModal: ModalDirective;

  @ViewChild('modalContainer', { read: ViewContainerRef })
  private modalContainer: ViewContainerRef;

  modal: ComponentRef<Component>;
  hasScrollY: boolean = false;
  syncPercentage: number = 0;
  syncString: string;
  closeOnEscape: boolean = true;
  enableClose: boolean;

  private logger: any = Log.create('modals.component');

  constructor (
    private _element: ElementRef,
    private _resolver: ComponentFactoryResolver,
    private _modalService: ModalsService,
    public _dialogRef: MdDialogRef<ModalsComponent>
  ) {
    // update new modal, open it
    this._modalService.getMessage().subscribe(
      message => {
        if (message.close) {
          this.close();
        } else {
          this.open(message.modal, message.data);
        }
      }
    );

    // update progress bar blockstatus
    this._modalService.getProgress().subscribe(
      progress => this.updateProgress(<number>progress)
    );
  }

  ngOnInit() {
    this.enableClose = this._modalService.enableClose;
  }

  ngDoCheck() {
    this.enableClose = this._modalService.enableClose;
    if (this._element) {
      const element = this._element.nativeElement;
      const style = element.ownerDocument.defaultView.getComputedStyle(element, undefined);
      this.hasScrollY = style.overflowY === 'scroll'
        || (style.overflowY === 'auto' && element.clientHeight < element.scrollHeight);
    }
  }

  // open modal
  open(message: any, data?: any) {
    this.logger.d(`open modal ${message.name}` + (data ? ` with data ${data}` : ''));
    this.modalContainer.clear();
    const factory = this._resolver.resolveComponentFactory(message);
    this.modal = this.modalContainer.createComponent(factory);
    const dynamicModal = this.modal as any;
    if (data !== undefined && dynamicModal.instance.setData !== undefined) {
      dynamicModal.instance.setData(data);
    }
  }

  close() {
    this._dialogRef.close();
    // remove and destroy message
    this._modalService.close();
    this.modalContainer.remove();
    this.modal.destroy();
  }

  // close window on escape
  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: any) {
    if (this.closeOnEscape && this._modalService.enableClose
        && event.key.toLowerCase() === 'escape' && this.modal) {
        this.close();
    }
  }

  /**
    * Update sync progress
    * @param {number} number  The sync percentage
    */
  updateProgress(progress: number) {
    this.syncPercentage = progress;
    this.syncString = progress === 100
      ? 'blockchain fully synced'
      : `${progress.toFixed(2)} %`
  }
}