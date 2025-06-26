import { MappedOrder } from '@/app/mappers/mappedOrder';
import Accordion from '@/app/ui/accordion/accordion';
import Button from '@/app/ui/button/button';
import { changeToProcessing, changeToOnRent, changeToExpired, changeToDelivery, changeToCompleted, changeToCancelled, UpdateOrderPayload} from '@/app/api/orders/changeStatus';
import './OrderCard.scss';

interface OrderCardProps {
  order: MappedOrder;
  canBeChanged: boolean;
}

const handleChangeToProcessing = (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
            changeToProcessing(payload);
        } catch (error) {
          
        } finally {
        }
}

const handleChangeToOnRent = async (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
          await changeToOnRent(payload);
        } catch (error) {
          
        } finally {
        }
}

const handleChangeToExpired = async (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
          await changeToExpired(payload);
        } catch (error) {
          
        } finally {
        }
}

const handleChangeToDelivery = async (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
          await changeToDelivery(payload);
        } catch (error) {
          
        } finally {
        }
}

const handleChangeToCompleted = async (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
          await changeToCompleted(payload);
        } catch (error) {
          
        } finally {
        }
}

const handleChangeToCancelled = async (id: string) => {
    const payload: UpdateOrderPayload = { id }; 
    try {
          await changeToCancelled(payload);
        } catch (error) {
          
        } finally {
        }
}

const OrderCard: React.FC<OrderCardProps> = ({ order, canBeChanged }) => {
    return (
        <div className='order-card'>
            <p><strong>Заказ №</strong>{order.id}</p>
            <hr/>
            <p><strong>Получатель: </strong>{order.customer.fullName}</p>
            <p><strong>Телефон: </strong>{order.customer.phone}</p>
            <p><strong>Эл. почта: </strong>{order.customer.email}</p>
            <p><strong>Адрес доставки: </strong>{order.customer.address}</p>
            <hr/>
            <p><strong>Тип оплаты: </strong>{order.payment.typeText}</p>
            <p><strong>Сумма: </strong>{order.payment.total} ₽</p>
            <p><strong>Создан: </strong>{order.dates.createdAt}</p>
            <p><strong>Доставка: </strong>{order.dates.deliveryDate}</p>
            <p><strong>Вернуть до: </strong>{order.dates.expirationDate}</p>
            <p><strong>Статус: </strong>{order.status.text}</p>
            <hr/>

            <Accordion 
                className='order-card__books' 
                buttonClassName='order-card__books__button' 
                text='Состав заказа' 
                isAlwaysExpanded={false} 
                icon=''
                accordionBody={
                    <div className='order-card__books__content'>
                        {order.books.map((book) => (
                            <div className='order-card__books__content__book' key={book.id}>
                                <p>{book.id} {book.title}, {book.author}</p>
                                <p>{book.pricePerUnit} ₽ x {book.quantity} шт. = {book.totalPrice} ₽</p>
                                <hr/>
                            </div>
                        ))}
                    </div>
                } />

            {canBeChanged ? (<div className='order-card__buttons'>
                <Button onClick={() => handleChangeToProcessing(order.id)} text='В обработку' className='order-card__buttons__button' icon='' style={undefined}/>
                <Button onClick={() => handleChangeToDelivery(order.id)} text='Передано в доставку' className='order-card__buttons__button' icon='' style={undefined}/>
                <Button onClick={() => handleChangeToOnRent(order.id)} text='Доставлен' className='order-card__buttons__button' icon='' style={undefined}/>
                <Button onClick={() => handleChangeToExpired(order.id)} text='Вовзрат просрочен' className='order-card__buttons__button' icon='' style={undefined}/>
                <Button onClick={() => handleChangeToCompleted(order.id)} text='Книги вернули' className='order-card__buttons__button' icon='' style={undefined}/>
                <Button onClick={() => handleChangeToCancelled(order.id)} text='Отменить' className='order-card__buttons__button' icon='' style={undefined}/>
            </div>) :
            (<span></span>)}
        </div>
    );
};

export default OrderCard;