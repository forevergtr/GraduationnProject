'use strict';

exports.main = async (event, context) => {
  const { action, username, password, data, recordId } = event;

  const hardcodedUsers = [
    { username: 'admin', password: '123456' },
    { username: 'user', password: '123456' }
  ];

  if (action === 'login') {
    if (!username || !password) {
      return { code: -1, message: '用户名和密码不能为空' };
    }

    const hardcodedUser = hardcodedUsers.find(u => u.username === username && u.password === password);
    if (hardcodedUser) {
      return { code: 0, message: '登录成功', data: { username: hardcodedUser.username } };
    }

    try {
      const db = uniCloud.database();
      const userCollection = db.collection('users');
      const user = await userCollection.where({ username }).field({ username: 1, password: 1 }).get();

      if (user.data.length === 0) {
        return { code: -1, message: '用户名或密码错误' };
      }

      if (user.data[0].password !== password) {
        return { code: -1, message: '用户名或密码错误' };
      }

      return { code: 0, message: '登录成功', data: { username: user.data[0].username } };
    } catch (error) {
      return { code: -1, message: '登录失败', error: error.message };
    }
  }

  if (action === 'register') {
    if (!username || !password) {
      return { code: -1, message: '用户名和密码不能为空' };
    }

    try {
      const db = uniCloud.database();
      const userCollection = db.collection('users');
      const existingUser = await userCollection.where({ username }).get();

      if (existingUser.data.length > 0) {
        return { code: -1, message: '用户已存在' };
      }

      await userCollection.add({
        username,
        password,
        createdAt: new Date().toISOString()
      });

      return { code: 0, message: '注册成功' };
    } catch (error) {
      return { code: -1, message: '注册失败', error: error.message };
    }
  }

  if (username === undefined || username === null || username === '') {
    return { code: -1, message: '用户名不能为空' };
  }

  try {
    const db = uniCloud.database();

    switch (action) {
      case 'getPersonalHealthInfo': {
        const personalHealthInfoCollection = db.collection('personal_health_info');
        const result = await personalHealthInfoCollection.where({ username }).get();

        if (result.data.length > 0) {
          return { code: 0, message: '获取个人健康信息成功', data: result.data[0] };
        } else {
          return { code: 0, message: '获取个人健康信息成功', data: null };
        }
      }

      case 'savePersonalHealthInfo': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const personalHealthInfoCollection = db.collection('personal_health_info');
        const existingInfo = await personalHealthInfoCollection.where({ username }).get();

        if (existingInfo.data.length > 0) {
          await personalHealthInfoCollection.where({ username }).update({
            ...data,
            updatedAt: new Date().toISOString()
          });
        } else {
          await personalHealthInfoCollection.add({
            username,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        return { code: 0, message: '保存个人健康信息成功' };
      }

      case 'getCheckupRecords': {
        const checkupRecordsCollection = db.collection('checkup_records');
        const result = await checkupRecordsCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取体检记录成功', data: result.data };
      }

      case 'saveCheckupRecord': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const checkupRecordsCollection = db.collection('checkup_records');
        await checkupRecordsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存体检记录成功' };
      }

      case 'updateCheckupRecord': {
        if (!recordId || !data) {
          return { code: -1, message: '记录ID和数据不能为空' };
        }

        const checkupRecordsCollection = db.collection('checkup_records');
        await checkupRecordsCollection.doc(recordId).update({
          ...data,
          updatedAt: new Date().toISOString()
        });

        return { code: 0, message: '更新体检记录成功' };
      }

      case 'getHealthRecords': {
        const healthRecordsCollection = db.collection('health_records');
        const result = await healthRecordsCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取健康档案成功', data: result.data };
      }

      case 'saveHealthRecord': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const healthRecordsCollection = db.collection('health_records');
        await healthRecordsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存健康档案成功' };
      }

      case 'deleteHealthRecord': {
        if (!recordId) {
          return { code: -1, message: '记录ID不能为空' };
        }

        const healthRecordsCollection = db.collection('health_records');
        await healthRecordsCollection.doc(recordId).remove();

        return { code: 0, message: '删除健康档案成功' };
      }

      case 'getObstetricsRecords': {
        const obstetricsRecordsCollection = db.collection('obstetrics_records');
        const result = await obstetricsRecordsCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取产科建档信息成功', data: result.data };
      }

      case 'saveObstetricsRecord': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const obstetricsRecordsCollection = db.collection('obstetrics_records');
        await obstetricsRecordsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存产科建档信息成功' };
      }

      case 'deleteObstetricsRecord': {
        if (!recordId) {
          return { code: -1, message: '记录ID不能为空' };
        }

        const obstetricsRecordsCollection = db.collection('obstetrics_records');
        await obstetricsRecordsCollection.doc(recordId).remove();

        return { code: 0, message: '删除产科建档信息成功' };
      }

      case 'getAppointments': {
        const appointmentsCollection = db.collection('appointments');
        const result = await appointmentsCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取预约信息成功', data: result.data };
      }

      case 'saveAppointment': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const appointmentsCollection = db.collection('appointments');
        await appointmentsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存预约信息成功' };
      }

      case 'getPayments': {
        const paymentsCollection = db.collection('payments');
        const result = await paymentsCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取缴费信息成功', data: result.data };
      }

      case 'savePayment': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const paymentsCollection = db.collection('payments');
        await paymentsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存缴费信息成功' };
      }

      case 'updatePayment': {
        if (!recordId || !data) {
          return { code: -1, message: '记录ID和数据不能为空' };
        }

        const paymentsCollection = db.collection('payments');
        await paymentsCollection.doc(recordId).update({
          ...data,
          updatedAt: new Date().toISOString()
        });

        return { code: 0, message: '更新缴费信息成功' };
      }

      case 'updateAppointment': {
        if (!recordId || !data) {
          return { code: -1, message: '记录ID和数据不能为空' };
        }

        const appointmentsCollection = db.collection('appointments');
        await appointmentsCollection.doc(recordId).update({
          ...data,
          updatedAt: new Date().toISOString()
        });

        return { code: 0, message: '更新预约信息成功' };
      }

      case 'getWeightRecords': {
        const weightRecordsCollection = db.collection('weight_records');
        const result = await weightRecordsCollection.where({ username }).orderBy('date', 'desc').get();

        return { code: 0, message: '获取体重记录成功', data: result.data };
      }

      case 'saveWeightRecord': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const weightRecordsCollection = db.collection('weight_records');
        await weightRecordsCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存体重记录成功' };
      }

      case 'getInpatientBalance': {
        const inpatientBalanceCollection = db.collection('inpatient_balance');
        const result = await inpatientBalanceCollection.where({ username }).get();

        if (result.data.length > 0) {
          return { code: 0, message: '获取预交金余额成功', data: result.data[0].balance || 0 };
        } else {
          return { code: 0, message: '获取预交金余额成功', data: 0 };
        }
      }

      case 'saveInpatientBalance': {
        if (!data || data.balance === undefined) {
          return { code: -1, message: '数据不能为空' };
        }

        const inpatientBalanceCollection = db.collection('inpatient_balance');
        const existingBalance = await inpatientBalanceCollection.where({ username }).get();

        if (existingBalance.data.length > 0) {
          await inpatientBalanceCollection.where({ username }).update({
            balance: data.balance,
            updatedAt: new Date().toISOString()
          });
        } else {
          await inpatientBalanceCollection.add({
            username,
            balance: data.balance,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        return { code: 0, message: '保存预交金余额成功' };
      }

      case 'saveMedicalRecordCopy': {
        if (!data) {
          return { code: -1, message: '数据不能为空' };
        }

        const medicalRecordCopyCollection = db.collection('medical_record_copy');
        await medicalRecordCopyCollection.add({
          username,
          ...data,
          createdAt: new Date().toISOString()
        });

        return { code: 0, message: '保存病案复印申请成功' };
      }

      case 'getMedicalRecordCopies': {
        const medicalRecordCopyCollection = db.collection('medical_record_copy');
        const result = await medicalRecordCopyCollection.where({ username }).orderBy('createTime', 'desc').get();

        return { code: 0, message: '获取病案复印申请记录成功', data: result.data };
      }

      default:
        return { code: -1, message: '无效的操作' };
    }
  } catch (error) {
    return { code: -1, message: '操作失败', error: error.message };
  }
};