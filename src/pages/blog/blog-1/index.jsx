import Breadcumb3 from "@/components/breadcumb/Breadcumb3";

import BlogArea1 from "@/components/section/BlogArea1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Blog 1",
};

export default function BlogPage1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 />
      <BlogArea1 />
    </>
  );
}
