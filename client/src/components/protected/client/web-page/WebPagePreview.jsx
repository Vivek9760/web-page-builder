/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { useParams } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "../../../common-ui/Loader";

const RenderBlock = ({ block }) => {
  const { type, content, styles, children = [] } = block;

  switch (type) {
    case "text":
      const Heading = content?.heading || "p";
      return <Heading style={styles || {}}>{content?.text}</Heading>;

    case "image":
      return <img src={content?.url} alt={content?.alt || "image"} style={{ maxWidth: "100%", ...styles }} />;

    case "button":
      return (
        <a href={content?.link || "#"} className="btn btn-primary" style={{ ...styles, textDecoration: "none" }}>
          {content?.label}
        </a>
      );

    case "list":
      return (
        <ul style={styles || {}}>
          {content?.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "card":
      return (
        <div className="card text-center shadow-sm" style={{ width: "14rem", ...styles }}>
          {content?.image && <img src={content.image} className="card-img-top" alt={content.title || "Card image"} />}
          <div className="card-body">
            {content?.title && <h5 className="card-title">{content.title}</h5>}
            {content?.description && <p className="card-text">{content.description}</p>}
          </div>
        </div>
      );

    case "container":
      return (
        <div style={styles || {}}>
          {children.map((child) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      );

    default:
      return <div style={{ color: "red" }}>⚠️ Unknown block type: {type}</div>;
  }
};

const PagePreview = () => {
  const [webPage, setWebPage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();

  useEffect(() => {
    console.log(slug);
    fetchWebPage();
  }, []);

  const fetchWebPage = async () => {
    try {
      const { data } = await axios.get(`/api/user/web-page/${slug}`);
      setWebPage(data.webPage);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch webPage.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Loader isLoading={loading}>
      <div className="container my-5">
        <div className="text-center mb-4">
          <h1>{webPage.title}</h1>
          <p className="text-secondary">Slug: {webPage.slug}</p>
        </div>

        {webPage.blocks && webPage.blocks.map((block) => <RenderBlock key={block.id} block={block} />)}
      </div>
    </Loader>
  );
};

export default PagePreview;
