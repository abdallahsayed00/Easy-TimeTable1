 // تهيئة Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCgblJyZAKaGIpI9On-l3RFSn13SGKEPhM",
            authDomain: "easy-smart-time.firebaseapp.com",
            projectId: "easy-smart-time",
            storageBucket: "easy-smart-time.firebasestorage.app",
            messagingSenderId: "366822206103",
            appId: "1:366822206103:web:ba28da65323736207bd7d2",
            measurementId: "G-BBFTXPTENV"
        };

        // تهيئة Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const auth = firebase.auth();
        const db = firebase.firestore();

        // بيانات التطبيق
        const appData = {
            currentUser: null,
            userData: null,
            currentWeek: 0,
            rewards: [
                { id: 1, name: "المبتدئ", desc: "سجل أول مهمة", icon: "fas fa-seedling", unlocked: false },
                { id: 2, name: "المنظم", desc: "أضف 5 مواد", icon: "fas fa-calendar-check", unlocked: false },
                { id: 3, name: "المجتهد", desc: "أنجز 10 مهام", icon: "fas fa-graduation-cap", unlocked: false },
                { id: 4, name: "المنافس", desc: "احصل على 500 نقطة", icon: "fas fa-trophy", unlocked: false },
                { id: 5, name: "الملتزم", desc: "استمر لمدة 7 أيام", icon: "fas fa-medal", unlocked: false },
                { id: 6, name: "الخبير", desc: "أنهي جميع المهام", icon: "fas fa-crown", unlocked: false }
            ],
            achievements: [
                { id: 1, name: "البداية", desc: "سجل أول مهمة", icon: "fas fa-flag", earned: false },
                { id: 2, name: "المنظم", desc: "أنشئ جدولاً أسبوعياً", icon: "fas fa-calendar", earned: false },
                { id: 3, name: "المجتهد", desc: "أنجز 5 مهام", icon: "fas fa-tasks", earned: false },
                { id: 4, name: "المثابر", desc: "استمر 3 أيام متتالية", icon: "fas fa-fire", earned: false }
            ],
            islamicQuotes: [
                { text: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", source: "سورة المجادلة - الآية 11" },
                { text: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ", source: "سورة الزمر - الآية 9" },
                { text: "اطلبوا العلم من المهد إلى اللحد", source: "حديث شريف" },
                { text: "من سلك طريقًا يلتمس فيه علمًا سهل الله له به طريقًا إلى الجنة", source: "حديث شريف" },
                { text: "إنما يخشى الله من عباده العلماء", source: "سورة فاطر - الآية 28" },
                { text: "فضل العالم على العابد كفضل القمر على سائر الكواكب", source: "حديث شريف" },
                { text: "خيركم من تعلم القرآن وعلمه", source: "حديث شريف" }
            ],
            motivationalQuotes: [
                { text: "العلم في الصغر كالنقش في الحجر", source: "حكمة عربية" },
                { text: "ليس هناك تحدي أكبر من تحسين وتطوير ذاتك", source: "حكمة" },
                { text: "النجاح هو مجموع الجهود الصغيرة التي تتكرر يوماً بعد يوم", source: "روبرت كولير" },
                { text: "لا تؤجل عمل اليوم إلى الغد", source: "حكمة" },
                { text: "أعظم اكتشاف لجيلي هو أن الإنسان يمكن أن يغير حياته إذا غير اتجاهاته العقلية", source: "ويليام جيمس" }
            ]
        };

        // DOM Elements
        const authContainer = document.getElementById('authContainer');
        const appContainer = document.getElementById('appContainer');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');
        const addTaskForm = document.getElementById('addTaskForm');
        const addSubjectForm = document.getElementById('addSubjectForm');
        const addExamForm = document.getElementById('addExamForm');

        // تبديل بين تبويبات المصادقة
        function switchAuthTab(tab) {
            document.querySelectorAll('.auth-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.auth-tab').forEach(tabElement => {
                tabElement.classList.remove('active');
            });

            if (tab === 'login') {
                document.getElementById('loginContent').classList.add('active');
                document.querySelectorAll('.auth-tab')[0].classList.add('active');
            } else if (tab === 'register') {
                document.getElementById('registerContent').classList.add('active');
                document.querySelectorAll('.auth-tab')[1].classList.add('active');
            } else if (tab === 'forgot') {
                document.getElementById('forgotContent').classList.add('active');
            }
        }

        // أحداث التسجيل
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const grade = document.getElementById('registerGrade').value;
            
            const loading = document.getElementById('registerLoading');
            loading.style.display = 'block';
            
            try {
                // إنشاء مستخدم في Firebase Authentication
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // حفظ بيانات المستخدم في Firestore
                await db.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    grade: grade,
                    xp: 0,
                    level: 1,
                    tasksCompleted: 0,
                    subjectsCount: 0,
                    examsCount: 0,
                    joinDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
                
                showNotification('تم إنشاء حسابك بنجاح!');
                switchAuthTab('login');
                
            } catch (error) {
                console.error('Error creating account:', error);
                showNotification('حدث خطأ أثناء إنشاء الحساب: ' + error.message);
            } finally {
                loading.style.display = 'none';
            }
        });

        // أحداث تسجيل الدخول
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const loading = document.getElementById('loginLoading');
            loading.style.display = 'block';
            
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // تحميل بيانات المستخدم من Firestore
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    appData.currentUser = user;
                    appData.userData = userDoc.data();
                    appData.userData.id = user.uid;
                    
                    // تحديث آخر تسجيل دخول
                    await db.collection('users').doc(user.uid).update({
                        lastLogin: new Date().toISOString()
                    });
                    
                    showApp();
                    updateUserInfo();
                    showNotification('مرحباً بعودتك! ' + appData.userData.name);
                }
                
            } catch (error) {
                console.error('Error signing in:', error);
                showNotification('خطأ في تسجيل الدخول: ' + error.message);
            } finally {
                loading.style.display = 'none';
            }
        });

        // استعادة كلمة المرور
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('forgotEmail').value;
            
            const loading = document.getElementById('forgotLoading');
            loading.style.display = 'block';
            
            try {
                await auth.sendPasswordResetEmail(email);
                showNotification('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
                switchAuthTab('login');
            } catch (error) {
                console.error('Error sending reset email:', error);
                showNotification('حدث خطأ: ' + error.message);
            } finally {
                loading.style.display = 'none';
            }
        });

        // إضافة/تعديل مهمة جديدة
        addTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const taskId = document.getElementById('taskId').value;
            const taskData = {
                title: document.getElementById('taskTitle').value,
                subject: document.getElementById('taskSubject').value,
                type: document.getElementById('taskType').value,
                date: document.getElementById('taskDate').value,
                duration: parseFloat(document.getElementById('taskDuration').value),
                userId: appData.currentUser.uid,
                createdAt: new Date().toISOString()
            };
            
            try {
                if (taskId) {
                    // تعديل المهمة
                    await db.collection('tasks').doc(taskId).update(taskData);
                    showNotification('تم تعديل المهمة بنجاح!');
                } else {
                    // إضافة مهمة جديدة
                    taskData.completed = false;
                    await db.collection('tasks').add(taskData);
                    
                    // منح نقاط للمهمة
                    const newXP = (appData.userData.xp || 0) + 10;
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        xp: newXP
                    });
                    appData.userData.xp = newXP;
                    
                    showNotification('تم إضافة المهمة بنجاح! +10 نقاط');
                }
                
                closeModal('addTaskModal');
                loadTasks();
                updateStats();
                checkAchievements();
                
            } catch (error) {
                console.error('Error saving task:', error);
                showNotification('حدث خطأ أثناء حفظ المهمة: ' + error.message);
            }
        });

        // إضافة/تعديل مادة جديدة
        addSubjectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const subjectId = document.getElementById('subjectId').value;
            const subjectData = {
                name: document.getElementById('subjectName').value,
                day: document.getElementById('subjectDay').value,
                time: document.getElementById('subjectTime').value,
                userId: appData.currentUser.uid,
                createdAt: new Date().toISOString()
            };
            
            try {
                if (subjectId) {
                    // تعديل المادة
                    await db.collection('subjects').doc(subjectId).update(subjectData);
                    showNotification('تم تعديل المادة بنجاح!');
                } else {
                    // إضافة مادة جديدة
                    await db.collection('subjects').add(subjectData);
                    
                    // تحديث عدد المواد
                    const newCount = (appData.userData.subjectsCount || 0) + 1;
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        subjectsCount: newCount
                    });
                    appData.userData.subjectsCount = newCount;
                    
                    showNotification('تم إضافة المادة بنجاح!');
                }
                
                closeModal('addSubjectModal');
                loadTimetable();
                updateStats();
                checkAchievements();
                
            } catch (error) {
                console.error('Error saving subject:', error);
                showNotification('حدث خطأ أثناء حفظ المادة: ' + error.message);
            }
        });

        // إضافة/تعديل امتحان جديد
        addExamForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const examId = document.getElementById('examId').value;
            const examData = {
                subject: document.getElementById('examSubject').value,
                title: document.getElementById('examTitle').value,
                date: document.getElementById('examDate').value,
                time: document.getElementById('examTime').value,
                userId: appData.currentUser.uid,
                createdAt: new Date().toISOString()
            };
            
            try {
                if (examId) {
                    // تعديل الامتحان
                    await db.collection('exams').doc(examId).update(examData);
                    showNotification('تم تعديل الامتحان بنجاح!');
                } else {
                    // إضافة امتحان جديد
                    await db.collection('exams').add(examData);
                    
                    // تحديث عدد الامتحانات
                    const newCount = (appData.userData.examsCount || 0) + 1;
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        examsCount: newCount
                    });
                    appData.userData.examsCount = newCount;
                    
                    showNotification('تم إضافة الامتحان بنجاح!');
                }
                
                closeModal('addExamModal');
                loadExams();
                updateStats();
                
            } catch (error) {
                console.error('Error saving exam:', error);
                showNotification('حدث خطأ أثناء حفظ الامتحان: ' + error.message);
            }
        });

        // وظائف المساعدة
        function showApp() {
            authContainer.style.display = 'none';
            appContainer.style.display = 'flex';
            loadAllData();
            startQuotesRotation();
        }

        function updateUserInfo() {
            if (!appData.userData) return;
            
            const firstLetter = appData.userData.name.charAt(0);
            document.getElementById('userAvatar').textContent = firstLetter;
            document.getElementById('userName').textContent = appData.userData.name;
            document.getElementById('profileAvatar').textContent = firstLetter;
            document.getElementById('profileName').textContent = appData.userData.name;
            document.getElementById('profileGrade').textContent = `الصف: ${getGradeText(appData.userData.grade)}`;
            document.getElementById('welcomeMessage').textContent = `مرحباً بعودتك، ${appData.userData.name}! 🎉`;
        }

        async function updateStats() {
            if (!appData.userData) return;
            
            try {
                // تحميل المهام من Firestore
                const tasksSnapshot = await db.collection('tasks')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const completedTasks = tasks.filter(task => task.completed).length;
                const totalTasks = tasks.length;
                const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                // تحميل الامتحانات القادمة
                const examsSnapshot = await db.collection('exams')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const exams = examsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const upcomingExams = exams.filter(exam => new Date(exam.date) >= new Date()).length;
                
                // تحديث المستوى بناءً على النقاط
                const currentXP = appData.userData.xp || 0;
                const newLevel = Math.floor(currentXP / 100) + 1;
                if (newLevel > appData.userData.level) {
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        level: newLevel
                    });
                    appData.userData.level = newLevel;
                    showNotification(`مبروك! لقد وصلت إلى المستوى ${newLevel} 🌟`);
                }
                
                document.getElementById('statLevel').textContent = appData.userData.level || 1;
                document.getElementById('statXP').textContent = currentXP;
                document.getElementById('statTasks').textContent = `${progress}%`;
                document.getElementById('statExams').textContent = upcomingExams;
                
                document.getElementById('profileLevel').textContent = appData.userData.level || 1;
                document.getElementById('profileXP').textContent = currentXP;
                document.getElementById('profileTasks').textContent = completedTasks;
                document.getElementById('profileSubjects').textContent = appData.userData.subjectsCount || 0;
                document.getElementById('profileDays').textContent = Math.floor((new Date() - new Date(appData.userData.joinDate)) / (1000 * 60 * 60 * 24)) + 1;
            } catch (error) {
                console.error('Error updating stats:', error);
            }
        }

        async function loadAllData() {
            await loadTasks();
            await loadTimetable();
            await loadExams();
            loadRewards();
            loadAchievements();
            await updateStats();
        }

            async function loadTasks() {
                const upcomingTasks = document.getElementById('upcomingTasks');
                
                try {
                    // استخدام استعلام أبسط بدون شرط completed أولاً
                    const snapshot = await db.collection('tasks')
                        .where('userId', '==', appData.currentUser.uid)
                        .get();
                    
                    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    // تصفية المهام غير المكتملة محلياً
                    const tasks = allTasks.filter(task => !task.completed)
                                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                    if (tasks.length === 0) {
                            upcomingTasks.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-tasks"></i>
                                    <p>لا توجد مهام حالياً</p>
                                    <button class="btn btn-primary" onclick="openAddTaskModal()">إضافة أول مهمة</button>
                                </div>
                            `;
                        return;
                    }
                
                upcomingTasks.innerHTML = tasks.map(task => `
                            <div class="exam-item">
                                <div class="exam-info">
                                    <div class="exam-icon">
                                        <i class="fas fa-tasks"></i>
                                    </div>
                                    <div class="exam-details">
                                        <h4>${task.title}</h4>
                                        <p>${task.subject} - ${task.duration} ساعة</p>
                                    </div>
                                </div>
                                <div class="exam-date">${formatDate(task.date)}</div>
                                <div class="action-buttons">
                                    <button class="btn btn-success btn-sm" onclick="completeTask('${task.id}')">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button class="btn btn-warning btn-sm" onclick="editTask('${task.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('');
                    } catch (error) {
                        console.error('Error loading tasks:', error);
                        upcomingTasks.innerHTML = `
                            <div class="empty-state">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>حدث خطأ في تحميل المهام</p>
                                <button class="btn btn-primary" onclick="loadTasks()">إعادة المحاولة</button>
                            </div>
                        `;
                    }
                }

        async function loadTimetable() {
            const timetableContainer = document.getElementById('timetableContainer');
            
            try {
                const snapshot = await db.collection('subjects')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (subjects.length === 0) {
                    timetableContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-calendar-alt"></i>
                            <p>لم تقم بإضافة جدول دراسي بعد</p>
                            <button class="btn btn-primary" onclick="openAddSubjectModal()">إنشاء الجدول الدراسي</button>
                        </div>
                    `;
                    return;
                }
                
                // تحديث عنوان الأسبوع
                updateWeekTitle();
                
                // إنشاء جدول دراسي
                const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
                const times = ['8-10', '10-12', '12-2', '2-4', '4-6'];
                const dayNames = {'sunday': 'الأحد', 'monday': 'الإثنين', 'tuesday': 'الثلاثاء', 'wednesday': 'الأربعاء', 'thursday': 'الخميس'};
                
                let tableHTML = `
                    <table class="timetable">
                        <thead>
                            <tr>
                                <th>الوقت/اليوم</th>
                                ${days.map(day => `<th>${dayNames[day]}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                times.forEach(time => {
                    tableHTML += `<tr><th>${time.replace('-', ':00-')}:00</th>`;
                    days.forEach(day => {
                        const subject = subjects.find(s => s.day === day && s.time === time);
                        tableHTML += `<td class="subject-cell">`;
                        if (subject) {
                            tableHTML += `
                                <div class="subject-name">${subject.name}</div>
                                <div class="subject-time">${time.replace('-', ':00-')}:00</div>
                                <div class="subject-actions">
                                    <button class="btn btn-warning btn-sm" onclick="editSubject('${subject.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteSubject('${subject.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `;
                        } else {
                            tableHTML += `
                                <button class="btn btn-secondary btn-sm" onclick="openAddSubjectModalForSlot('${day}', '${time}')">
                                    <i class="fas fa-plus"></i> إضافة
                                </button>
                            `;
                        }
                        tableHTML += `</td>`;
                    });
                    tableHTML += `</tr>`;
                });
                
                tableHTML += `</tbody></table>`;
                timetableContainer.innerHTML = tableHTML;
            } catch (error) {
                console.error('Error loading timetable:', error);
                timetableContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>حدث خطأ في تحميل الجدول الدراسي</p>
                    </div>
                `;
            }
        }

        async function loadExams() {
            const examsList = document.getElementById('examsList');
            
            try {
                // استخدام استعلام أبسط بدون ترتيب أولاً
                const snapshot = await db.collection('exams')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                
                if (exams.length === 0) {
                    examsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <p>لا توجد امتحانات مسجلة</p>
                            <button class="btn btn-primary" onclick="openAddExamModal()">إضافة أول امتحان</button>
                        </div>
                    `;
                    return;
                }
                
                examsList.innerHTML = exams.map(exam => `
                    <div class="exam-item">
                        <div class="exam-info">
                            <div class="exam-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="exam-details">
                                <h4>${exam.title}</h4>
                                <p>${exam.subject} - ${exam.time}</p>
                            </div>
                        </div>
                        <div class="exam-date">${formatDate(exam.date)}</div>
                        <div class="action-buttons">
                            <button class="btn btn-warning btn-sm" onclick="editExam('${exam.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteExam('${exam.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading exams:', error);
                examsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>حدث خطأ في تحميل الامتحانات</p>
                        <button class="btn btn-primary" onclick="loadExams()">إعادة المحاولة</button>
                    </div>
                `;
            }
        }

        function loadRewards() {
            const rewardsGrid = document.getElementById('rewardsGrid');
            rewardsGrid.innerHTML = appData.rewards.map(reward => `
                <div class="reward-card ${reward.unlocked ? 'unlocked' : 'locked'}">
                    <div class="reward-icon">
                        <i class="${reward.icon}"></i>
                    </div>
                    <div class="reward-name">${reward.name}</div>
                    <div class="reward-desc">${reward.desc}</div>
                </div>
            `).join('');
        }

        function loadAchievements() {
            const achievementsGrid = document.getElementById('achievementsGrid');
            achievementsGrid.innerHTML = appData.achievements.map(achievement => `
                <div class="achievement-card ${achievement.earned ? 'earned' : ''}">
                    <div class="achievement-icon">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `).join('');
        }

        async function checkAchievements() {
            try {
                // تحميل البيانات الحالية للتحقق من الإنجازات
                const tasksSnapshot = await db.collection('tasks')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const completedTasks = tasks.filter(task => task.completed).length;
                
                const subjectsSnapshot = await db.collection('subjects')
                    .where('userId', '==', appData.currentUser.uid)
                    .get();
                
                const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // إنجاز البداية - أول مهمة
                if (tasks.length >= 1 && !appData.achievements[0].earned) {
                    appData.achievements[0].earned = true;
                    showNotification('مبروك! حصلت على إنجاز "البداية" 🎉');
                }
                
                // إنجاز المنظم - جدول أسبوعي
                if (subjects.length >= 5 && !appData.achievements[1].earned) {
                    appData.achievements[1].earned = true;
                    showNotification('مبروك! حصلت على إنجاز "المنظم" 🎉');
                }
                
                // إنجاز المجتهد - 5 مهام مكتملة
                if (completedTasks >= 5 && !appData.achievements[2].earned) {
                    appData.achievements[2].earned = true;
                    showNotification('مبروك! حصلت على إنجاز "المجتهد" 🎉');
                }
                
                loadAchievements();
            } catch (error) {
                console.error('Error checking achievements:', error);
            }
        }

        // وظائف التعديل والحذف
        async function editTask(taskId) {
            try {
                const taskDoc = await db.collection('tasks').doc(taskId).get();
                if (taskDoc.exists) {
                    const task = taskDoc.data();
                    document.getElementById('taskId').value = taskId;
                    document.getElementById('taskTitle').value = task.title;
                    document.getElementById('taskSubject').value = task.subject;
                    document.getElementById('taskType').value = task.type;
                    document.getElementById('taskDate').value = task.date.replace(' ', 'T');
                    document.getElementById('taskDuration').value = task.duration;
                    
                    document.getElementById('taskModalTitle').textContent = 'تعديل المهمة';
                    document.getElementById('taskSubmitBtn').textContent = 'تحديث المهمة';
                    openModal('addTaskModal');
                }
            } catch (error) {
                console.error('Error editing task:', error);
                showNotification('حدث خطأ أثناء تحميل المهمة');
            }
        }

        async function editSubject(subjectId) {
            try {
                const subjectDoc = await db.collection('subjects').doc(subjectId).get();
                if (subjectDoc.exists) {
                    const subject = subjectDoc.data();
                    document.getElementById('subjectId').value = subjectId;
                    document.getElementById('subjectName').value = subject.name;
                    document.getElementById('subjectDay').value = subject.day;
                    document.getElementById('subjectTime').value = subject.time;
                    
                    document.getElementById('subjectModalTitle').textContent = 'تعديل المادة';
                    document.getElementById('subjectSubmitBtn').textContent = 'تحديث المادة';
                    openModal('addSubjectModal');
                }
            } catch (error) {
                console.error('Error editing subject:', error);
                showNotification('حدث خطأ أثناء تحميل المادة');
            }
        }

        async function editExam(examId) {
            try {
                const examDoc = await db.collection('exams').doc(examId).get();
                if (examDoc.exists) {
                    const exam = examDoc.data();
                    document.getElementById('examId').value = examId;
                    document.getElementById('examSubject').value = exam.subject;
                    document.getElementById('examTitle').value = exam.title;
                    document.getElementById('examDate').value = exam.date;
                    document.getElementById('examTime').value = exam.time;
                    
                    document.getElementById('examModalTitle').textContent = 'تعديل الامتحان';
                    document.getElementById('examSubmitBtn').textContent = 'تحديث الامتحان';
                    openModal('addExamModal');
                }
            } catch (error) {
                console.error('Error editing exam:', error);
                showNotification('حدث خطأ أثناء تحميل الامتحان');
            }
        }

        async function deleteTask(taskId) {
            if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
                try {
                    await db.collection('tasks').doc(taskId).delete();
                    showNotification('تم حذف المهمة بنجاح');
                    loadTasks();
                    updateStats();
                } catch (error) {
                    console.error('Error deleting task:', error);
                    showNotification('حدث خطأ أثناء حذف المهمة');
                }
            }
        }

        async function deleteSubject(subjectId) {
            if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
                try {
                    await db.collection('subjects').doc(subjectId).delete();
                    
                    // تحديث عدد المواد
                    const newCount = (appData.userData.subjectsCount || 1) - 1;
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        subjectsCount: newCount
                    });
                    appData.userData.subjectsCount = newCount;
                    
                    showNotification('تم حذف المادة بنجاح');
                    loadTimetable();
                    updateStats();
                } catch (error) {
                    console.error('Error deleting subject:', error);
                    showNotification('حدث خطأ أثناء حذف المادة');
                }
            }
        }

        async function deleteExam(examId) {
            if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
                try {
                    await db.collection('exams').doc(examId).delete();
                    
                    // تحديث عدد الامتحانات
                    const newCount = (appData.userData.examsCount || 1) - 1;
                    await db.collection('users').doc(appData.currentUser.uid).update({
                        examsCount: newCount
                    });
                    appData.userData.examsCount = newCount;
                    
                    showNotification('تم حذف الامتحان بنجاح');
                    loadExams();
                    updateStats();
                } catch (error) {
                    console.error('Error deleting exam:', error);
                    showNotification('حدث خطأ أثناء حذف الامتحان');
                }
            }
        }

        async function completeTask(taskId) {
            try {
                await db.collection('tasks').doc(taskId).update({
                    completed: true
                });
                
                // تحديث المهام المنجزة
                const newCompleted = (appData.userData.tasksCompleted || 0) + 1;
                await db.collection('users').doc(appData.currentUser.uid).update({
                    tasksCompleted: newCompleted
                });
                appData.userData.tasksCompleted = newCompleted;
                
                showNotification('أحسنت! تم إكمال المهمة بنجاح 🎉');
                loadTasks();
                updateStats();
                checkAchievements();
            } catch (error) {
                console.error('Error completing task:', error);
                showNotification('حدث خطأ أثناء إكمال المهمة');
            }
        }

        // وظائف التنقل بين الأسابيع
        function changeWeek(direction) {
            appData.currentWeek += direction;
            loadTimetable();
        }

        function updateWeekTitle() {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay() + 7 * appData.currentWeek);
            
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            
            const weekTitle = `أسبوع ${startDate.toLocaleDateString('ar-EG')} - ${endDate.toLocaleDateString('ar-EG')}`;
            document.getElementById('currentWeek').textContent = weekTitle;
        }

        function openAddSubjectModalForSlot(day, time) {
            document.getElementById('subjectDay').value = day;
            document.getElementById('subjectTime').value = time;
            openModal('addSubjectModal');
        }

        // وظائف الجمل التحفيزية
        function startQuotesRotation() {
            // تغيير الجملة الإسلامية كل دقيقة
            setInterval(() => {
                const randomQuote = appData.islamicQuotes[Math.floor(Math.random() * appData.islamicQuotes.length)];
                document.getElementById('islamicQuote').innerHTML = `"${randomQuote.text}"<br><small>${randomQuote.source}</small>`;
            }, 60000);
            
            // تغيير الجملة التحفيزية كل 30 ثانية
            setInterval(() => {
                const randomQuote = appData.motivationalQuotes[Math.floor(Math.random() * appData.motivationalQuotes.length)];
                document.getElementById('motivationText').textContent = `"${randomQuote.text}"`;
                document.getElementById('motivationAuthor').textContent = `- ${randomQuote.source}`;
            }, 30000);
        }

        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
            const form = document.getElementById(modalId.replace('Modal', 'Form'));
            form.reset();
            
            // مسح الحقول المخفية
            const hiddenFields = form.querySelectorAll('input[type="hidden"]');
            hiddenFields.forEach(field => {
                field.value = '';
            });
            
            // إعادة تعيين عناوين النماذج
            if (modalId === 'addTaskModal') {
                document.getElementById('taskModalTitle').textContent = 'إضافة مهمة جديدة';
                document.getElementById('taskSubmitBtn').textContent = 'إضافة المهمة';
            } else if (modalId === 'addSubjectModal') {
                document.getElementById('subjectModalTitle').textContent = 'إضافة مادة دراسية';
                document.getElementById('subjectSubmitBtn').textContent = 'إضافة المادة';
            } else if (modalId === 'addExamModal') {
                document.getElementById('examModalTitle').textContent = 'إضافة امتحان';
                document.getElementById('examSubmitBtn').textContent = 'إضافة الامتحان';
            }
        }

        function openAddTaskModal() {
            openModal('addTaskModal');
        }

        function openAddSubjectModal() {
            openModal('addSubjectModal');
        }

        function openAddExamModal() {
            openModal('addExamModal');
        }

        function logout() {
            auth.signOut().then(() => {
                appData.currentUser = null;
                appData.userData = null;
                appContainer.style.display = 'none';
                authContainer.style.display = 'flex';
                switchAuthTab('login');
                showNotification('تم تسجيل الخروج بنجاح');
            });
        }

        function formatDate(dateString) {
            try {
                if (!dateString) return 'غير محدد';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                return date.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return dateString;
            }
        }


        function getGradeText(grade) {
            const grades = {
                'grade1': 'الصف الأول الابتدائي',
                'grade2': 'الصف الثاني الابتدائي',
                'grade3': 'الصف الثالث الابتدائي',
                'grade4': 'الصف الرابع الابتدائي',
                'grade5': 'الصف الخامس الابتدائي',
                'grade6': 'الصف السادس الابتدائي',
                'grade7': 'الصف الأول الإعدادي',
                'grade8': 'الصف الثاني الإعدادي',
                'grade9': 'الصف الثالث الإعدادي',
                'grade10': 'الصف الأول الثانوي',
                'grade11': 'الصف الثاني الثانوي',
                'grade12': 'الصف الثالث الثانوي',
                'uni1': 'السنة الأولى جامعة',
                'uni2': 'السنة الثانية جامعة',
                'uni3': 'السنة الثالثة جامعة',
                'uni4': 'السنة الرابعة جامعة'
            };
            return grades[grade] || 'غير محدد';
        }

        function showNotification(message) {
            // إنشاء إشعار بسيط
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // التنقل بين الصفحات
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                
                // تحديث التبويب النشط
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
                
                // إظهار الصفحة المحددة
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                
                // تحديث عنوان الصفحة
                const titles = {
                    'home': 'الصفحة الرئيسية',
                    'timetable': 'الجدول الدراسي',
                    'exams': 'جدول الامتحانات',
                    'profile': 'الملف الشخصي'
                };
                document.getElementById('pageTitle').textContent = titles[pageId];
            });
        });

        // التحقق من حالة المستخدم عند تحميل الصفحة
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // المستخدم مسجل الدخول
                try {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        appData.currentUser = user;
                        appData.userData = userDoc.data();
                        appData.userData.id = user.uid;
                        
                        showApp();
                        updateUserInfo();
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            }
        });