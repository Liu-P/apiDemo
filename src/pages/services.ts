/*
 * @Description:
 * @Author: LCL
 * @Date: 2023-03-09
 * @LastEditors: LCL
 * @LastEditTime: 2023-03-10
 */

import { request } from 'umi';

export async function findDataById(data: any) {
  return request<Record<string, any>>('/api/apply/findbyid', {
    method: 'POST',
    data,
  });
}

export async function applyRequest(data: any) {
  return request<Record<string, any>>('/api/apply/sdksaves', {
    method: 'POST',
    data,
  });
}

export async function getStampData(data: any) {
  return request<Record<string, any>>('/api/apply/all/search', {
    method: 'POST',
    data,
  });
}
