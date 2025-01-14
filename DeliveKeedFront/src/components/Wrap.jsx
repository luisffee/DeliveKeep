import './Wrap.css';
import keyboardWrapper from '../images/keyboardWrapper.jpg';
import truckWrapper from '../images/truckWrapper.jpg';
import boxWrapper from '../images/stock.jpg';
import walkingWrapper from '../images/reception.jpg';
import deliveryWrapper from '../images/deliver.jpg';
import cartShpIcon from '../images/cartShp.png';
import truckIcon from '../images/truck.png';
import boxIcon from '../images/package.png';
import walkingIcon from '../images/directions_walk.png';
import homeIcon from '../images/home.png';

const Wrap = () => (
    <div className="wrap">
        <div className="actions">
            <div className="caixinhas">
                <div className="colorCx">
                    <img src={keyboardWrapper} style={{ opacity: 0.3 }} />
                    <img className="cxIcon" src={cartShpIcon} />
                </div>
            </div>

            <div className="caixinhas">
                <div className="colorCx">
                    <img src={truckWrapper} style={{ opacity: 0.3 }} />
                    <img className="cxIcon" src={truckIcon} />
                </div>
            </div>

            <div className="caixinhas">
                <div className="colorCx">
                    <img src={boxWrapper} style={{ opacity: 0.3 }} />
                    <img className="cxIcon" src={boxIcon} />
                </div>
            </div>

            <div className="caixinhas">
                <div className="colorCx">
                    <img src={walkingWrapper} style={{ opacity: 0.3 }} />
                    <img className="cxIcon" src={walkingIcon} />
                </div>
            </div>

            <div className="caixinhas">
                <div className="colorCx">
                    <img src={deliveryWrapper} style={{ opacity: 0.3 }} />
                    <img className="cxIcon" src={homeIcon} />
                </div>
            </div>
        </div>

        <div className="actions">
            <div className="bottomPassos">
                <p>Acompanhe os pedidos</p>
            </div>
            <div className="bottomPassos">
                <p>Seu armazém</p>
            </div>
            <div className="bottomPassos">
                <p>Retire onde quiser</p>
            </div>
        </div>
    </div>
);

export default Wrap;
