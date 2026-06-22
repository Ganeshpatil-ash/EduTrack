/**
 * Pure data-transform helpers that turn raw API records into chart-ready
 * shapes. Kept separate from the React Query hooks so they're easy to unit
 * test and reuse across Dashboard / Reports / Student Profile.
 */

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Buckets students/courses/attendance creation dates into the last N months. */
export function computeMonthlyActivity(students = [], courses = [], attendance = [], months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTH_LABELS[d.getMonth()], students: 0, courses: 0, attendance: 0 });
  }
  const indexFor = (dateStr) => {
    const d = new Date(dateStr);
    return buckets.findIndex((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
  };
  students.forEach((s) => { const i = indexFor(s.createdAt); if (i >= 0) buckets[i].students++; });
  courses.forEach((c) => { const i = indexFor(c.createdAt); if (i >= 0) buckets[i].courses++; });
  attendance.forEach((a) => { const i = indexFor(a.createdAt || a.date); if (i >= 0) buckets[i].attendance++; });
  return buckets.map(({ key, ...rest }) => rest);
}

/** Distinct students with at least one attendance record per course. */
export function computeCourseEnrollment(courses = [], attendance = []) {
  const byCourse = new Map();
  attendance.forEach((a) => {
    const courseId = a.courseId?._id || a.courseId;
    if (!courseId) return;
    if (!byCourse.has(courseId)) byCourse.set(courseId, new Set());
    const studentId = a.studentId?._id || a.studentId;
    if (studentId) byCourse.get(courseId).add(studentId);
  });
  return courses
    .map((c) => ({
      courseCode: c.courseCode,
      courseName: c.courseName,
      students: byCourse.get(c._id)?.size || 0,
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 8);
}

/** % change in record count created in the last `days` vs. the prior `days`. */
export function computeGrowthTrend(items = [], days = 30) {
  const now = Date.now();
  const cutoff1 = now - days * 86400000;
  const cutoff2 = now - days * 2 * 86400000;
  const recent = items.filter((i) => new Date(i.createdAt).getTime() >= cutoff1).length;
  const previous = items.filter((i) => {
    const t = new Date(i.createdAt).getTime();
    return t >= cutoff2 && t < cutoff1;
  }).length;
  if (previous === 0) return { deltaPct: recent > 0 ? 100 : 0, direction: recent > 0 ? 'up' : 'flat' };
  const deltaPct = Math.round(((recent - previous) / previous) * 100);
  return { deltaPct: Math.abs(deltaPct), direction: deltaPct > 0 ? 'up' : deltaPct < 0 ? 'down' : 'flat' };
}

/**
 * Builds a day-by-day heatmap grid for the last `weeks` weeks.
 * mode 'rate'   -> value is overall attendance % for that day (aggregate view)
 * mode 'status' -> value is 'Present' | 'Absent' for a single student's day
 */
export function computeHeatmapData(attendance = [], { weeks = 14, mode = 'rate' } = {}) {
  const days = weeks * 7;
  const map = new Map();

  attendance.forEach((a) => {
    const date = new Date(a.date).toISOString().slice(0, 10);
    if (!map.has(date)) map.set(date, []);
    map.get(date).push(a.status);
  });

  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const statuses = map.get(key) || [];

    if (mode === 'status') {
      const status = statuses.includes('Present') ? 'Present' : statuses.includes('Absent') ? 'Absent' : null;
      result.push({ date: key, status, level: status === 'Present' ? 4 : status === 'Absent' ? 1 : 0 });
    } else {
      const present = statuses.filter((s) => s === 'Present').length;
      const rate = statuses.length ? present / statuses.length : null;
      const level = rate === null ? 0 : rate >= 0.9 ? 4 : rate >= 0.7 ? 3 : rate >= 0.5 ? 2 : 1;
      result.push({ date: key, rate, level, count: statuses.length });
    }
  }
  return result;
}

export function computeAttendanceSummary(attendance = []) {
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'Present').length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  // longest current "present" streak counting back from most recent record
  const sorted = [...attendance].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  for (const record of sorted) {
    if (record.status === 'Present') streak++;
    else break;
  }

  return { total, present, absent, pct, streak };
}
