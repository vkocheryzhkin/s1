import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchFeedOrderByNumber } from '@services/feed/feed-actions';
import { clearFeedCurrentOrder, selectFeedOrders } from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchProfileOrderByNumber } from '@services/profile-orders/profile-orders-actions';
import {
  clearProfileCurrentOrder,
  selectProfileOrders,
} from '@services/profile-orders/profile-orders-slice';
import { isValidOrder } from '@utils/order';

import type { TOrder } from '@utils/types';

type TOrderDetailsResult = {
  order: TOrder | null;
  isLoading: boolean;
};

type TOrderSource = 'feed' | 'profile';

export const useOrderDetails = (source: TOrderSource): TOrderDetailsResult => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const orderNumber = Number(id);

  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const { currentOrder: feedCurrentOrder, isCurrentOrderLoading: isFeedOrderLoading } =
    useAppSelector((state) => state.feed);
  const {
    currentOrder: profileCurrentOrder,
    isCurrentOrderLoading: isProfileOrderLoading,
  } = useAppSelector((state) => state.profileOrders);

  const orders = source === 'feed' ? feedOrders : profileOrders;
  const currentOrder = source === 'feed' ? feedCurrentOrder : profileCurrentOrder;
  const isCurrentOrderLoading =
    source === 'feed' ? isFeedOrderLoading : isProfileOrderLoading;

  const ingredientsMap = new Map(ingredients.map((item) => [item._id, item]));
  const orderFromList = orders.find((item) => item.number === orderNumber);
  const orderFromStore = currentOrder?.number === orderNumber ? currentOrder : null;
  const rawOrder = orderFromList ?? orderFromStore;
  const order = rawOrder && isValidOrder(rawOrder, ingredientsMap) ? rawOrder : null;

  useEffect(() => {
    if (!Number.isFinite(orderNumber)) {
      return;
    }

    if (orderFromList) {
      if (source === 'feed') {
        dispatch(clearFeedCurrentOrder());
      } else {
        dispatch(clearProfileCurrentOrder());
      }
      return;
    }

    void dispatch(
      source === 'feed'
        ? fetchFeedOrderByNumber(orderNumber)
        : fetchProfileOrderByNumber(orderNumber)
    );
  }, [dispatch, orderFromList, orderNumber, source]);

  useEffect(
    () => (): void => {
      if (source === 'feed') {
        dispatch(clearFeedCurrentOrder());
      } else {
        dispatch(clearProfileCurrentOrder());
      }
    },
    [dispatch, source]
  );

  return {
    order,
    isLoading: !order && isCurrentOrderLoading,
  };
};
