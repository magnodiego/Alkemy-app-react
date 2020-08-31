import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class Details extends React.Component {
    render(){
        return (
            <div>
            <Modal isOpen={true} toggle={this.props.closeModal}>
                <img src={this.props.appImg} className="card-img-top" alt="App logo"/>
                <ModalHeader toggle={this.props.closeModal}>{this.props.app.name}</ModalHeader>
                <ModalBody>
                    {this.props.app.descript}
                    <div className="text-right">
                            <h3 className='pricing-card-title'> {this.props.app.price === 0 ? 'Free!' : `$ ${this.props.priceFormat(this.props.app.price)}` }</h3>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
            </div>
        )
    }
}
